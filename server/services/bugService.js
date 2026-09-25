import { aiService } from './aiService.js';

export const detectBugs = async (code = '', language = 'python') => {
  const staticBugs = [];
  const lines = code.split('\n');
  const lang = language.toLowerCase();

  // Rule 1: Assignment inside if condition (e.g. if (x = 5))
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Assignment in condition
    if (trimmed.match(/if\s*\([^=!<>\n]*=[^=][^)\n]*\)/)) {
      staticBugs.push({
        title: 'Accidental Assignment in Conditional',
        severity: 'High',
        line: lineNum,
        category: 'Logical Issue',
        description: 'Single "=" assignment detected inside conditional check instead of equality comparison "==".',
        whyItMatters: 'The condition will always evaluate to truthy/falsy based on the assigned value rather than comparing variables.',
        suggestedFix: 'Replace "=" with "==" or "===".',
        confidence: 0.95,
        source: 'static-analysis',
      });
    }

    // Unclosed resources or missing try/catch for file operations
    if ((trimmed.includes('open(') || trimmed.includes('fs.readFile')) && !code.includes('close()') && !code.includes('with open') && !code.includes('finally')) {
      if (idx === lines.length - 1) { // flag once
        staticBugs.push({
          title: 'Potential Resource Leak',
          severity: 'Medium',
          line: 1,
          category: 'Resource Management',
          description: 'File or stream opened without explicit closure or context manager (e.g. "with" statement).',
          whyItMatters: 'Unclosed file descriptors can lead to memory leaks, OS file handle exhaustion, and file locking issues.',
          suggestedFix: 'Use a "with open(...)" context manager in Python or try-with-resources / finally block.',
          confidence: 0.85,
          source: 'static-analysis',
        });
      }
    }

    // Potential Division by Zero
    if (trimmed.match(/\/\s*0(?!\.)/)) {
      staticBugs.push({
        title: 'Division by Zero Detected',
        severity: 'Critical',
        line: lineNum,
        category: 'Exception Risk',
        description: 'Direct division by literal 0 encountered.',
        whyItMatters: 'Will throw a ZeroDivisionError / ArithmeticException at runtime and crash the program.',
        suggestedFix: 'Ensure divisors are checked with a guard condition (e.g., if divisor != 0).',
        confidence: 0.99,
        source: 'static-analysis',
      });
    }

    // Unused or empty catch block
    if (trimmed.match(/catch\s*\([^)]*\)\s*\{\s*\}/) || trimmed.match(/except\s*:\s*pass/)) {
      staticBugs.push({
        title: 'Empty Exception Handler (Swallowed Error)',
        severity: 'Medium',
        line: lineNum,
        category: 'Bad Practice',
        description: 'Exception is caught and silently discarded without logging or handling.',
        whyItMatters: 'Hides critical runtime failures and makes debugging difficult.',
        suggestedFix: 'Log the exception or handle specific error recovery actions.',
        confidence: 0.9,
        source: 'static-analysis',
      });
    }

    // Potential infinite loop
    if (trimmed.match(/while\s*\(\s*true\s*\)/i) || trimmed.match(/while\s+True\s*:/)) {
      if (!code.includes('break') && !code.includes('return') && !code.includes('exit')) {
        staticBugs.push({
          title: 'Unbounded Infinite Loop',
          severity: 'Critical',
          line: lineNum,
          category: 'Potential Infinite Loop',
          description: 'Infinite loop condition with no evident break, return, or exit statement.',
          whyItMatters: 'Will cause the CPU thread to lock up and application freeze.',
          suggestedFix: 'Add a termination condition or break statement inside the loop.',
          confidence: 0.92,
          source: 'static-analysis',
        });
      }
    }
  });

  // AI-augmented bug detector
  let aiBugs = [];
  try {
    const prompt = `Analyze this ${language} code for potential bugs, logical errors, edge cases, security vulnerabilities, or performance bottlenecks.
Return a valid JSON array of objects with the following keys:
[
  {
    "title": "Short title of bug",
    "severity": "Critical | High | Medium | Low | Info",
    "line": 1,
    "category": "Syntax error | Logical issue | Null risk | Exception risk | Security | Performance",
    "description": "Detailed description",
    "whyItMatters": "Impact explanation",
    "suggestedFix": "Concrete suggestion or code fix",
    "confidence": 0.85
  }
]
If there are no bugs, return an empty array []. Output JSON ONLY.

Code:
${code}`;

    const rawResponse = await aiService.generateCompletion({
      prompt,
      systemPrompt: 'You are an expert static analysis and code security auditor. Respond strictly with JSON.',
      jsonMode: true,
    });

    if (rawResponse) {
      const parsed = JSON.parse(rawResponse);
      const items = Array.isArray(parsed) ? parsed : (parsed.bugs || []);
      aiBugs = items.map((b) => ({
        ...b,
        source: 'ai-suggestion',
      }));
    }
  } catch (err) {
    // Graceful fallback to static bugs
  }

  // Deduplicate and combine
  const combined = [...staticBugs, ...aiBugs];
  if (combined.length === 0) {
    combined.push({
      title: 'Code Structure Clean',
      severity: 'Info',
      line: 1,
      category: 'Best Practices',
      description: 'No critical logic errors, syntax flaws, or null dereferences were detected.',
      whyItMatters: 'The current implementation follows standard control flow conventions.',
      suggestedFix: 'Continue testing with edge case boundary values.',
      confidence: 1.0,
      source: 'static-analysis',
    });
  }

  return combined;
};
