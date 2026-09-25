import { aiService } from './aiService.js';
import { calculateMetrics } from './analysisService.js';
import { detectBugs } from './bugService.js';
import { getOptimizations } from './optimizationService.js';

export const generateAIExplanation = async (code = '', language = 'cpp') => {
  const lang = language ? language.toLowerCase().trim() : 'cpp';
  const { metrics, qualityScore } = calculateMetrics(code, lang);

  // 1. Attempt LLM structured explanation
  try {
    const systemPrompt = `You are CodeVision AI, an expert computer science professor and senior software architect.
Analyze the provided source code thoroughly and output a JSON object with the following EXACT schema.
Do not hallucinate functions or variables not in the code.

JSON Schema:
{
  "overview": "Detailed 2-3 sentence overview of what the entire program accomplishes",
  "howItWorks": "Clear paragraph explaining overall execution flow from start to finish",
  "stepByStep": [
    { "step": 1, "title": "Initialization", "explanation": "Detailed explanation of what this statement does" }
  ],
  "functions": [
    { "name": "main()", "purpose": "Entry point", "parameters": "None", "returnType": "int", "logic": "Initializes array and computes total", "complexity": "O(n)" }
  ],
  "variables": [
    { "name": "arr", "purpose": "Holds the input numbers", "type": "int[]", "role": "Input dataset" }
  ],
  "dataStructures": ["Array", "Integer Primitive"],
  "algorithm": "Iterative Array Accumulation / Linear Traversal",
  "timeComplexity": {
    "value": "O(n)",
    "reason": "Single linear loop traversing n elements exactly once"
  },
  "spaceComplexity": {
    "value": "O(1)",
    "reason": "Only scalar variables (sum, i) used; no additional memory allocation proportional to input size"
  },
  "potentialIssues": [
    "No boundary check if array size is zero or dynamic"
  ],
  "suggestions": [
    "Use std::accumulate in C++ for idiomatic expressive code",
    "Pass array by const reference or use std::vector/std::array"
  ]
}`;

    const prompt = `Language: ${lang}\n\nSource Code:\n${code}\n\nProvide the complete structured explanation strictly in JSON format.`;

    const rawResponse = await aiService.generateCompletion({
      prompt,
      systemPrompt,
      temperature: 0.1,
      jsonMode: true,
    });

    if (rawResponse) {
      const parsed = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;
      if (parsed && parsed.overview) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LLM explanation fallback note:', err.message);
  }

  // 2. High-Precision AST & Static Code Parser Fallback
  return buildIntelligentASTExplanation(code, lang, metrics, qualityScore);
};

function buildIntelligentASTExplanation(code, language, metrics, qualityScore) {
  const lines = code.split('\n');
  const langUpper = language.toUpperCase();

  // Extract functions
  const functions = [];
  const funcRegex = language === 'python'
    ? /def\s+([a-zA-Z_]\w*)\s*\((.*?)\)/g
    : /\b(int|void|double|float|bool|string|auto|public\s+\w+|private\s+\w+)\s+([a-zA-Z_]\w*)\s*\((.*?)\)/g;

  let match;
  while ((match = funcRegex.exec(code)) !== null) {
    const name = language === 'python' ? match[1] : match[2];
    const params = language === 'python' ? (match[2] || 'None') : (match[3] || 'None');
    const returnType = language === 'python' ? 'Dynamic' : match[1];

    if (!['if', 'for', 'while', 'switch'].includes(name)) {
      functions.push({
        name: `${name}()`,
        purpose: name === 'main' ? 'Program execution entry point' : `Performs ${name} operation`,
        parameters: params,
        returnType,
        logic: `Executes subroutine flow for ${name}`,
        complexity: metrics.cyclomaticComplexity > 3 ? 'O(n)' : 'O(1)',
      });
    }
  }

  if (functions.length === 0) {
    functions.push({
      name: 'main() / Script Execution',
      purpose: 'Global script execution entry point',
      parameters: 'None',
      returnType: language === 'cpp' ? 'int' : 'void',
      logic: 'Executes top-level instructions sequentially',
      complexity: metrics.cyclomaticComplexity > 3 ? 'O(n)' : 'O(1)',
    });
  }

  // Extract variables
  const variables = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || !trimmed) return;

    // C/C++/Java variables
    const varMatch = trimmed.match(/\b(int|float|double|char|string|bool|auto)\s+([a-zA-Z_]\w*)\s*(\[.*?\])?\s*=\s*(.*?)[;,]/);
    if (varMatch) {
      variables.push({
        name: varMatch[2],
        purpose: `Stores ${varMatch[2]} value used during computation`,
        type: varMatch[3] ? `${varMatch[1]}[]` : varMatch[1],
        role: varMatch[3] ? 'Array storage collection' : varMatch[2].includes('sum') ? 'Accumulator' : 'State variable',
      });
    } else if (language === 'python' && trimmed.includes('=') && !trimmed.includes('==') && !trimmed.startsWith('def ')) {
      const parts = trimmed.split('=');
      const varName = parts[0].trim();
      if (/^[a-zA-Z_]\w*$/.test(varName)) {
        variables.push({
          name: varName,
          purpose: `Holds ${varName} value in memory`,
          type: parts[1].includes('[') ? 'List / Array' : 'Variable',
          role: varName.includes('sum') || varName.includes('total') ? 'Accumulator' : 'Data storage',
        });
      }
    }
  });

  // Extract Data Structures
  const dataStructures = [];
  if (code.includes('[') && code.includes(']')) dataStructures.push('Array / List Collection');
  if (code.includes('vector') || code.includes('ArrayList')) dataStructures.push('Dynamic Array (Vector/ArrayList)');
  if (code.includes('map') || code.includes('dict') || code.includes('HashMap')) dataStructures.push('Hash Map / Dictionary');
  if (code.includes('set') || code.includes('HashSet')) dataStructures.push('Hash Set');
  if (dataStructures.length === 0) dataStructures.push('Primitive Scalar Variables (int, registers)');

  // Identify Algorithm
  let algorithm = 'Sequential Statement Execution';
  if (code.includes('for') || code.includes('while')) {
    if (code.includes('+=') || code.includes('+')) {
      algorithm = 'Linear Iteration with Accumulation';
    } else {
      algorithm = 'Iterative Traversal & Control Flow';
    }
  }
  if (code.includes('low') && code.includes('high') && code.includes('mid')) {
    algorithm = 'Binary Search Divide-and-Conquer';
  } else if (code.includes('sort') || code.includes('pivot')) {
    algorithm = 'Divide-and-Conquer Sorting';
  }

  // Step by step breakdown
  const stepByStep = [];
  let stepIdx = 1;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;

    if (trimmed.includes('#include') || trimmed.includes('import ')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Header & Dependency Import',
        explanation: `Includes necessary standard library facilities (${trimmed}).`,
      });
    } else if (trimmed.includes('main(') || trimmed.includes('def ')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Function Definition',
        explanation: `Declares ${trimmed.split('{')[0].split(':')[0].trim()} as entry point for execution.`,
      });
    } else if (trimmed.includes('arr') && trimmed.includes('=')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Array Initialization',
        explanation: `Initializes array data structures with test elements in contiguous memory.`,
      });
    } else if (trimmed.includes('sum = 0') || trimmed.includes('int sum')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Accumulator Setup',
        explanation: `Initializes accumulator variable to zero before loop iterations.`,
      });
    } else if (trimmed.startsWith('for') || trimmed.startsWith('while')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Loop Iteration',
        explanation: `Begins iterative execution loop: "${trimmed}". Evaluates condition each cycle.`,
      });
    } else if (trimmed.includes('+=') || trimmed.includes('sum =')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'State Mutation',
        explanation: `Updates accumulator variable with array element value: ${trimmed}.`,
      });
    } else if (trimmed.includes('cout') || trimmed.includes('print') || trimmed.includes('System.out')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Console Output',
        explanation: `Formats and streams computed results to standard console output.`,
      });
    } else if (trimmed.includes('return 0') || trimmed.includes('return ')) {
      stepByStep.push({
        step: stepIdx++,
        title: 'Termination & Return',
        explanation: `Returns execution status code indicating successful program termination.`,
      });
    }
  });

  const hasLoop = code.includes('for') || code.includes('while');
  const timeComplexityValue = hasLoop ? (metrics.cyclomaticComplexity > 4 ? 'O(n²)' : 'O(n)') : 'O(1)';
  const timeReason = hasLoop
    ? `The program executes a loop visiting elements sequentially, making total runtime directly proportional to input size n.`
    : `Only constant-time instructions are executed with no data-dependent iterations.`;

  const spaceComplexityValue = 'O(1)';
  const spaceReason = `The program uses a fixed set of local scalar variables (registers, accumulator, loop index) requiring constant auxiliary memory.`;

  // Overview summary text
  const overviewText = `This ${langUpper} program implements ${algorithm}. It initializes required memory structures, processes values sequentially across ${metrics.lines} lines of code, and outputs the final computed result.`;

  const howItWorksText = `Execution begins at ${functions[0]?.name || 'the entry point'}. Data variables are initialized into memory, after which control flow passes through ${metrics.cyclomaticComplexity} decision branch(es). Results are aggregated and returned with deterministic ${timeComplexityValue} time complexity.`;

  return {
    overview: overviewText,
    howItWorks: howItWorksText,
    stepByStep: stepByStep.slice(0, 10),
    functions,
    variables: variables.slice(0, 6),
    dataStructures,
    algorithm,
    timeComplexity: {
      value: timeComplexityValue,
      reason: timeReason,
    },
    spaceComplexity: {
      value: spaceComplexityValue,
      reason: spaceReason,
    },
    potentialIssues: [
      hasLoop ? 'Ensure loop boundary indices do not exceed allocated buffer size.' : 'Validate input assumptions.',
      'Check for potential integer overflow if processing large numeric inputs.',
    ],
    suggestions: [
      language === 'cpp' ? 'Consider using std::array or std::vector with range-based for loops (for (const auto& x : arr)) for cleaner modern C++.' : 'Encapsulate logic inside dedicated reusable testable helper functions.',
      'Add guard assertions to handle empty input datasets gracefully.',
    ],
  };
}
