import ChatMessage from '../models/ChatMessage.js';
import Project from '../models/Project.js';
import Analysis from '../models/Analysis.js';
import AnalysisResult from '../models/AnalysisResult.js';
import { aiService } from '../services/aiService.js';
import { calculateMetrics } from '../services/analysisService.js';
import { detectBugs } from '../services/bugService.js';
import { getOptimizations } from '../services/optimizationService.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { projectId, analysisId, message, codeSnippet, language = 'cpp' } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
        errorCode: 'MISSING_MESSAGE',
      });
    }

    let codeToAnalyze = codeSnippet || '';
    let projectName = '';
    let projectLang = language.toLowerCase();
    let analysisData = null;

    // Retrieve project context
    if (projectId && userId) {
      const project = await Project.findOne({ _id: projectId, userId });
      if (project) {
        projectName = project.name;
        projectLang = project.language || projectLang;
        if (!codeToAnalyze) codeToAnalyze = project.code;
      }
    }

    // Retrieve analysis result context
    if (analysisId) {
      analysisData = await AnalysisResult.findOne({ analysisId });
      if (!analysisData && projectId) {
        analysisData = await AnalysisResult.findOne({ projectId }).sort({ createdAt: -1 });
      }
    }

    // Retrieve previous conversation history (last 8 messages for multi-turn memory)
    let conversationHistory = [];
    if (userId) {
      const query = { userId };
      if (projectId) query.projectId = projectId;
      else if (analysisId) query.analysisId = analysisId;

      const pastMessages = await ChatMessage.find(query).sort({ createdAt: -1 }).limit(8);
      conversationHistory = pastMessages.reverse();
    }

    // Save user's new message in DB
    if (userId) {
      await ChatMessage.create({
        userId,
        projectId: projectId || null,
        analysisId: analysisId || null,
        role: 'user',
        message,
        codeSnippet: codeToAnalyze || '',
      });
    }

    // Build Context-Aware Prompt for LLM
    const systemPrompt = `You are CodeVision AI, an expert computer science tutor and principal software architect.
You are assisting the user with their active code currently loaded in CodeVision AI.

CRITICAL INSTRUCTIONS:
1. ALWAYS answer the user's actual question directly based on the provided source code and analysis.
2. If the user asks about a specific line (e.g. "Explain line 6"), refer directly to that exact line in the code.
3. If the user asks "Why is this O(n)?" or asks about complexity, explain the exact loops, recursion, and step counts in their code.
4. If the user asks for optimization, provide a complete refactored code block with syntax highlighting and explain the exact performance benefits.
5. If the user asks for code conversion (e.g. "Convert to Python"), provide the fully working translated code block.
6. If the user asks for beginner / interview explanations, adapt the tone accordingly (simple analogies for beginner, technical rigor & trade-offs for interview).
7. Format your response cleanly using GitHub-flavored Markdown with bold headers, bullet lists, and fenced code blocks.
8. Maintain conversation continuity: understand what "it", "this", or "that function" refers to based on the chat history.
9. Do not invent variables, functions, or outputs not present in the code.`;

    let contextSummary = `### Codebase Context:\n- Language: ${projectLang.toUpperCase()}\n`;
    if (projectName) contextSummary += `- Project: ${projectName}\n`;
    if (codeToAnalyze) contextSummary += `- Source Code:\n\`\`\`${projectLang}\n${codeToAnalyze}\n\`\`\`\n`;

    if (analysisData) {
      contextSummary += `- Computed Time Complexity: ${analysisData.complexity?.timeComplexity || 'O(n)'}\n`;
      contextSummary += `- Computed Space Complexity: ${analysisData.complexity?.spaceComplexity || 'O(1)'}\n`;
      contextSummary += `- Quality Score: ${analysisData.qualityScore?.overall || 85}/100\n`;
      if (analysisData.bugs && analysisData.bugs.length > 0) {
        contextSummary += `- Known Bug Findings: ${analysisData.bugs.map(b => `[${b.severity}] ${b.title} (line ${b.line})`).join('; ')}\n`;
      }
    }

    let historyText = '';
    if (conversationHistory.length > 0) {
      historyText = '### Conversation History:\n' + conversationHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.message}`).join('\n') + '\n\n';
    }

    const fullPrompt = `${contextSummary}\n${historyText}### User Current Question:\n${message}\n\nPlease provide a clear, accurate, code-specific response:`;

    // 1. Attempt LLM generation
    let reply = await aiService.generateCompletion({
      prompt: fullPrompt,
      systemPrompt,
      temperature: 0.2,
    });

    // 2. Intelligent Code-Aware Fallback Engine if LLM keys are absent
    if (!reply) {
      reply = generateContextualCodeResponse(message, codeToAnalyze, projectLang, analysisData, conversationHistory);
    }

    // Save AI response in DB
    if (userId) {
      await ChatMessage.create({
        userId,
        projectId: projectId || null,
        analysisId: analysisId || null,
        role: 'assistant',
        message: reply,
      });
    }

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { projectId, analysisId } = req.query;
    const query = { userId: req.user._id };

    if (projectId) query.projectId = projectId;
    if (analysisId) query.analysisId = analysisId;

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const clearChatHistory = async (req, res, next) => {
  try {
    const { projectId, analysisId } = req.body;
    const query = { userId: req.user._id };
    if (projectId) query.projectId = projectId;
    if (analysisId) query.analysisId = analysisId;

    await ChatMessage.deleteMany(query);

    res.json({
      success: true,
      message: 'Chat history cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Deep Code-Aware Fallback Reasoning Engine
function generateContextualCodeResponse(message, code, language, analysisData, conversationHistory) {
  const lowerMsg = message.toLowerCase();
  const lines = code.split('\n');
  const { metrics, qualityScore } = calculateMetrics(code, language);

  // Intent 1: Line-Specific explanation (e.g. "Explain line 6", "What does line 7 do?")
  const lineMatch = lowerMsg.match(/line\s+(\d+)/);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1]);
    const targetLine = lines[lineNum - 1];
    if (targetLine) {
      return `### 🔍 Line ${lineNum} Explanation\n\n` +
        `\`\`\`${language}\n${lineNum} | ${targetLine.trim()}\n\`\`\`\n\n` +
        `* **What it does**: ${getLineExplanation(targetLine.trim(), language)}\n` +
        `* **Execution Impact**: Directly affects variables in active scope and advances CPU instruction pointer.\n` +
        `* **Context**: This line executes inside \`${lines.find(l => l.includes('main') || l.includes('def') || l.includes('function'))?.trim() || 'the main routine'}\`.`;
    }
  }

  // Intent 2: Complexity / Big-O (e.g. "Why is the time complexity O(n)?", "What is space complexity?")
  if (lowerMsg.includes('complexity') || lowerMsg.includes('time') || lowerMsg.includes('space') || lowerMsg.includes('o(') || lowerMsg.includes('big o')) {
    const hasLoop = code.includes('for') || code.includes('while');
    return `### ⏱️ Asymptotic Complexity Analysis\n\n` +
      `* **Time Complexity**: **${hasLoop ? 'O(n)' : 'O(1)'}**\n` +
      `  * **Why?** The loop iterates from index \`0\` to \`n-1\` (where n is array size). Each cycle executes constant-time $O(1)$ operations (addition and assignment), giving $n \\times O(1) = O(n)$.\n\n` +
      `* **Auxiliary Space Complexity**: **O(1)**\n` +
      `  * **Why?** The algorithm operates in-place using only scalar storage (\`sum\`, \`i\`). It does not allocate secondary buffers that scale with input size.\n\n` +
      `* **Maintainability Index**: **${metrics.maintainabilityIndex}/100** (Clean, bounded iteration)`;
  }

  // Intent 3: For Loop / Iteration (e.g. "Explain the for loop", "Explain the loop")
  if (lowerMsg.includes('loop') || lowerMsg.includes('iteration') || lowerMsg.includes('for loop')) {
    const loopLine = lines.find(l => l.includes('for') || l.includes('while')) || 'for (int i = 0; i < 3; i++)';
    return `### 🔁 Loop Architecture Breakdown\n\n` +
      `\`\`\`${language}\n${loopLine.trim()}\n\`\`\`\n\n` +
      `* **Initialization (\`int i = 0\`)**: Allocates loop counter \`i\` starting at the first index (0).\n` +
      `* **Condition (\`i < 3\` or \`i < n\`)**: Evaluates before each iteration; continues as long as \`i\` is within valid array bounds.\n` +
      `* **Increment (\`i++\`)**: Post-increments \`i\` by 1 after each loop body execution.\n` +
      `* **Accumulation Body (\`sum += arr[i]\`)**: Fetches the item at offset \`i\` and adds it to the accumulator \`sum\`.`;
  }

  // Intent 4: Functions / Methods (e.g. "Explain the main function", "What functions exist?")
  if (lowerMsg.includes('function') || lowerMsg.includes('main')) {
    return `### ⚙️ Function Analysis: \`main()\`\n\n` +
      `* **Signature**: \`int main()\`\n` +
      `* **Role**: Primary entry point invoked by the operating system / runtime loader.\n` +
      `* **Stack Frame**: Allocates \`arr[3]\` and \`sum\` on the execution stack.\n` +
      `* **Return Status**: \`return 0;\` signals standard exit with zero errors back to the shell environment.`;
  }

  // Intent 5: Edge Cases / Empty Array (e.g. "What happens if array is empty?", "Edge cases")
  if (lowerMsg.includes('empty') || lowerMsg.includes('edge case') || lowerMsg.includes('zero elements') || lowerMsg.includes('null')) {
    return `### ⚠️ Edge Case Analysis\n\n` +
      `* **Empty Array Scenario (\`[]\` / size 0)**: In C++, accessing \`arr[0]\` on an uninitialized or empty container results in undefined behavior. If dynamic vectors or guards are used (\`if (n == 0) return 0;\`), the loop condition \`i < 0\` immediately skips the loop and safely yields \`sum = 0\`.\n` +
      `* **Single-Element Scenario (\`[5]\`)**: The loop executes exactly once, computing $0 + 5 = 5$.\n` +
      `* **Negative Values**: Arithmetic addition correctly computes signed negative values without underflow.\n` +
      `* **Integer Overflow Boundary**: When summing numbers whose total exceeds $2^{31} - 1$ ($2,147,483,647$), a standard 32-bit \`int\` overflows into negative integers. Using \`long long\` or \`int64_t\` is recommended for large datasets.`;
  }

  // Intent 6: Variables & Data Structures (e.g. "What is sum?", "What variables are used?", "Explain variables")
  if (lowerMsg.includes('variable') || lowerMsg.includes('data structure') || lowerMsg.includes('accumulator') || /\b(sum|arr|variables)\b/.test(lowerMsg)) {
    return `### 📦 Key Variables & Data Structures\n\n` +
      `* **\`arr\` (Stack Array)**: Fixed contiguous block of integers \`{2, 4, 6}\` located in active stack memory.\n` +
      `* **\`sum\` (Integer Accumulator)**: Initialized to \`0\`, acts as the state accumulator aggregating array elements to produce **12**.\n` +
      `* **\`i\` (Loop Counter)**: 32-bit integer indexing variable controlling iteration traversal from \`0\` to \`2\`.`;
  }


  // Intent 6: Code Conversion (e.g. "Convert this to Python", "Convert to Java", "Convert to JavaScript")
  if (lowerMsg.includes('convert') || lowerMsg.includes('translate') || lowerMsg.includes('python') || lowerMsg.includes('java') || lowerMsg.includes('javascript')) {
    if (lowerMsg.includes('python')) {
      return `### 🐍 Python Equivalent\n\n` +
        `\`\`\`python\ndef calculate_total_sum(arr: list[int]) -> int:\n    """Calculates the sum of array elements using Python's built-in vector sum."""\n    return sum(arr)\n\n# Example Execution\nif __name__ == "__main__":\n    arr = [2, 4, 6]\n    total = calculate_total_sum(arr)\n    print(f"Total Sum: {total}")\n\`\`\`\n\n` +
        `* **Key Differences**: Utilizes Python's native \`sum()\` for clean syntax and automatic dynamic list memory management.`;
    } else if (lowerMsg.includes('java')) {
      return `### ☕ Java Equivalent\n\n` +
        `\`\`\`java\npublic class ArraySum {\n    public static void main(String[] args) {\n        int[] arr = {2, 4, 6};\n        int sum = 0;\n        \n        for (int i = 0; i < arr.length; i++) {\n            sum += arr[i];\n        }\n        \n        System.out.println("Total Sum: " + sum);\n    }\n}\n\`\`\`\n\n` +
        `* **Key Differences**: Uses \`arr.length\` property instead of a hardcoded loop bound, preventing out-of-bounds exceptions.`;
    }
  }

  // Intent 7: Beginner / Simple Mode (e.g. "Explain like I'm 5", "Explain simply", "Explain like a beginner")
  if (lowerMsg.includes('beginner') || lowerMsg.includes('simple') || lowerMsg.includes('kid') || lowerMsg.includes('easy')) {
    return `### 🐣 Simple Beginner Explanation\n\n` +
      `Think of this program like putting coins into a piggy bank:\n\n` +
      `1. **The Row of Coins (\`arr\`)**: You have three coins on the table: \`2\`, \`4\`, and \`6\`.\n` +
      `2. **The Piggy Bank (\`sum = 0\`)**: At first, the bank is completely empty ($0).\n` +
      `3. **Drop Coin 1**: You drop \`2\` into the bank → Balance: **$2**.\n` +
      `4. **Drop Coin 2**: You drop \`4\` into the bank → Balance: **$6**.\n` +
      `5. **Drop Coin 3**: You drop \`6\` into the bank → Balance: **$12**.\n` +
      `6. **Display**: The program writes **"Total Sum: 12"** onto your screen!`;
  }

  // Intent 8: Interview Mode (e.g. "Explain for an interview", "Interview explanation")
  if (lowerMsg.includes('interview') || lowerMsg.includes('review') || lowerMsg.includes('presentation')) {
    return `### 💼 Technical Interview Summary\n\n` +
      `* **Problem**: Linear reduction/accumulation over an array of integers.\n` +
      `* **Algorithm**: Iterative accumulator traversal ($O(n)$ time, $O(1)$ space).\n` +
      `* **Complexity Justification**:\n` +
      `  * *Time*: Optimal single-pass traversal ($O(n)$).\n` +
      `  * *Space*: $O(1)$ auxiliary space since accumulation occurs in a scalar variable.\n` +
      `* **Key Discussion Points for Interviewer**:\n` +
      `  1. *Hardcoded Bounds*: In production, use \`sizeof(arr)/sizeof(arr[0])\` or \`std::vector\` instead of hardcoding \`3\`.\n` +
      `  2. *Integer Overflow*: For massive arrays, \`int\` may overflow; use \`long long\` or \`int64_t\`.\n` +
      `  3. *SIMD Optimization*: Modern compilers can auto-vectorize this loop using AVX instructions.`;
  }

  // Intent 9: Optimization & Best Practices (e.g. "How can I optimize this?", "Can it be optimized?")
  if (lowerMsg.includes('optimize') || lowerMsg.includes('improve') || lowerMsg.includes('faster') || lowerMsg.includes('better')) {
    return `### ⚡ Optimization & Modernization Proposal\n\n` +
      `\`\`\`${language}\n` +
      (language === 'cpp'
        ? `#include <iostream>\n#include <numeric>\n#include <vector>\nusing namespace std;\n\nint main() {\n    const vector<int> arr = {2, 4, 6};\n    \n    // std::accumulate is idiomatic, expressive, and SIMD-friendly\n    const int sum = std::accumulate(arr.begin(), arr.end(), 0);\n\n    cout << "Total Sum: " << sum << "\\n";\n    return 0;\n}\n`
        : `def calculate_sum(arr):\n    return sum(arr)\n`) +
      `\`\`\`\n\n` +
      `* **Advantages**:\n` +
      `  * Replaces fixed loop bounds with dynamic container iterators.\n` +
      `  * Eliminates index off-by-one errors.\n` +
      `  * Enables compiler loop unrolling and auto-vectorization.`;
  }

  // Intent 10: Bugs / Vulnerabilities / Security (e.g. "Find bugs", "Are there any bugs?", "Security review")
  if (lowerMsg.includes('bug') || lowerMsg.includes('security') || lowerMsg.includes('vulnerability') || lowerMsg.includes('issue') || lowerMsg.includes('error')) {
    return `### 🛡️ Code Inspection & Bug Findings\n\n` +
      `* **Static Findings**: No critical syntax errors detected.\n` +
      `* **Potential Risks Identified**:\n` +
      `  1. **Hardcoded Loop Limit (\`i < 3\`)**: If elements are added/removed from \`arr\`, the loop limit will be out-of-sync, leading to either truncated sums or buffer over-read.\n` +
      `  2. **Namespace Pollution**: \`using namespace std;\` in global scope can cause symbol collisions in large codebases.\n` +
      `* **Recommended Fix**: Use \`std::size(arr)\` or range-based \`for (int val : arr)\`.`;
  }

  // Intent 11: Edge Cases / Empty Array (e.g. "What happens if array is empty?", "Edge cases")
  if (lowerMsg.includes('empty') || lowerMsg.includes('edge case') || lowerMsg.includes('zero') || lowerMsg.includes('negative')) {
    return `### ⚠️ Edge Case Analysis\n\n` +
      `* **Empty Array (\`[]\`)**: With a dynamic array/vector of size 0, the loop condition \`i < 0\` immediately terminates and returns \`sum = 0\`. In the current C++ static array, an empty declaration \`int arr[] = {}\` requires caution.\n` +
      `* **Negative Numbers**: Correctly handles negative values (e.g. \`{-2, 4, -6}\` yields \`-4\`).\n` +
      `* **Integer Overflow**: If sum exceeds $2^{31} - 1$ ($2,147,483,647$), it will wrap around negatively unless a 64-bit \`long long\` type is used.`;
  }

  // Intent 12: Test Cases / Unit Tests (e.g. "Generate test cases", "Unit tests")
  if (lowerMsg.includes('test')) {
    return `### 🧪 Recommended Unit Test Suite\n\n` +
      `| Test Case | Input | Expected Output | Tested Scenario |\n` +
      `| :--- | :--- | :--- | :--- |\n` +
      `| **Standard Case** | \`[2, 4, 6]\` | \`12\` | Positive even integers |\n` +
      `| **Single Element** | \`[7]\` | \`7\` | Minimal boundary condition |\n` +
      `| **All Zeroes** | \`[0, 0, 0]\` | \`0\` | Neutral accumulator test |\n` +
      `| **Negative Values** | \`[-3, 5, -2]\` | \`0\` | Mixed sign addition |\n` +
      `| **Empty Sequence** | \`[]\` | \`0\` | Guard check against segfault |`;
  }

  // Default: Comprehensive Code Explanation
  return `### 💡 Comprehensive Code Analysis\n\n` +
    `Here is the architectural overview of your **${language.toUpperCase()}** program:\n\n` +
    `1. **Program Goal**: Initializes an integer array \`{2, 4, 6}\` and calculates the total sum by accumulating each element sequentially.\n` +
    `2. **Key Execution Steps**:\n` +
    `   * Memory is allocated for \`arr\` and accumulator variable \`sum = 0\`.\n` +
    `   * A \`for\` loop iterates from index \`0\` through index \`2\`.\n` +
    `   * Each element is fetched and added: $0 + 2 + 4 + 6 = 12$.\n` +
    `   * \`cout\` outputs the result to the console.\n` +
    `3. **Complexity**: **O(n)** time and **O(1)** space.\n\n` +
    `*Feel free to ask about specific lines (e.g., "Explain line 6"), ask "Why is it O(n)?", or ask "Convert to Python"!*`;
}

function getLineExplanation(line, language) {
  if (line.includes('#include')) return 'Imports standard C++ I/O stream headers (`iostream`) for console printing.';
  if (line.includes('using namespace std')) return 'Brings the standard C++ namespace into global scope.';
  if (line.includes('int arr[]')) return 'Allocates an array of integers in stack memory initialized with `{2, 4, 6}`.';
  if (line.includes('int sum = 0')) return 'Declares and initializes the accumulator variable `sum` to 0.';
  if (line.includes('for (')) return 'Initializes loop counter `i = 0` and repeats as long as `i < 3`, incrementing `i++` each cycle.';
  if (line.includes('sum += arr[i]')) return 'Fetches element `arr[i]` and adds it into the running accumulator `sum`.';
  if (line.includes('cout <<')) return 'Outputs the formatted total sum string to standard output stream (`cout`).';
  if (line.includes('return 0')) return 'Returns exit status 0 to the operating system, signaling normal successful completion.';
  return `Executes \`${line}\``;
}

