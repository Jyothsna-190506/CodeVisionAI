// Robust helper to extract and clean JSON object from LLM response.
export const parseJSONFromLLM = (text) => {
  if (!text) return null;

  let cleaned = text.trim();

  // Strip <think>...</think> reasoning blocks
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Strip markdown code fences
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

  // Find JSON object boundaries using brace-depth counting
  const extracted = extractBalancedObject(cleaned);
  if (extracted) cleaned = extracted;

  // Attempt 1: parse as-is
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt 2: sanitize and auto-repair truncated JSON strings
    try {
      const sanitized = sanitizeJSONString(cleaned);
      return JSON.parse(sanitized);
    } catch (err2) {
      console.warn('Failed to parse LLM JSON output after repair:', err2.message);
      return null;
    }
  }
};

function extractBalancedObject(str) {
  const start = str.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < str.length; i++) {
    const ch = str[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return str.substring(start, i + 1);
      }
    }
  }

  return str.substring(start);
}

function sanitizeJSONString(str) {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (inString) {
      if (escaped) {
        result += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        result += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
        result += ch;
        continue;
      }
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { continue; }
      if (ch === '\t') { result += '\\t'; continue; }
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = true;
      result += ch;
      continue;
    }

    result += ch;
  }

  // Auto-close string if truncated mid-string
  if (inString) {
    result += '"';
  }

  // Remove trailing commas before ] or }
  result = result.replace(/,\s*([\]}])/g, '$1');

  // Auto-balance open brackets and braces for truncated responses
  let openBrackets = 0;
  let openBraces = 0;
  let inStr = false;
  for (let i = 0; i < result.length; i++) {
    if (result[i] === '"' && (i === 0 || result[i-1] !== '\\')) inStr = !inStr;
    if (!inStr) {
      if (result[i] === '[') openBrackets++;
      if (result[i] === ']') openBrackets--;
      if (result[i] === '{') openBraces++;
      if (result[i] === '}') openBraces--;
    }
  }

  while (openBrackets > 0) { result += ']'; openBrackets--; }
  while (openBraces > 0) { result += '}'; openBraces--; }

  return result;
}