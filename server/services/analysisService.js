export const calculateMetrics = (code = '', language = 'python') => {
  const lines = code.split('\n');
  const totalLines = lines.length;
  let blankLines = 0;
  let commentLines = 0;
  let codeLines = 0;
  let functionCount = 0;
  let classCount = 0;
  let maxNestingDepth = 0;
  let cyclomaticComplexity = 1;

  const lang = language.toLowerCase();
  const isCStyle = ['c', 'cpp', 'java', 'javascript', 'typescript', 'csharp', 'go', 'rust', 'php'].includes(lang);
  const isPython = lang === 'python';

  let currentIndent = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      blankLines++;
      return;
    }

    if (isCStyle) {
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        commentLines++;
        return;
      }
    } else if (isPython) {
      if (trimmed.startsWith('#') || trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        commentLines++;
        return;
      }
    }

    codeLines++;

    // Complexity indicators
    const branchingMatches = trimmed.match(/\b(if|else\s+if|elif|for|while|case|catch|except|&&|\|\||\?)\b/g);
    if (branchingMatches) {
      cyclomaticComplexity += branchingMatches.length;
    }

    // Function declarations
    if (
      trimmed.match(/\b(def|function|fn|func|public\s+[\w<>]+\s+\w+|private\s+[\w<>]+\s+\w+|void\s+\w+|int\s+\w+\s*\(|const\s+\w+\s*=\s*(\(.*?\)|async\s*\(.*?\)|\w+)\s*=>)\b/)
    ) {
      functionCount++;
    }

    // Class declarations
    if (trimmed.match(/\b(class|struct|interface|type\s+\w+\s+struct)\b/)) {
      classCount++;
    }

    // Nesting depth
    if (isPython) {
      const leadingSpaces = line.search(/\S/);
      const depth = Math.floor(leadingSpaces / 4);
      if (depth > maxNestingDepth) maxNestingDepth = depth;
    } else {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      currentIndent += openBraces - closeBraces;
      if (currentIndent > maxNestingDepth) maxNestingDepth = currentIndent;
    }
  });

  if (maxNestingDepth < 1) maxNestingDepth = 1;

  // Maintainability Index Calculation (0-100)
  // MI = 171 - 5.2 * ln(Halstead Volume) - 0.23 * (Cyclomatic Complexity) - 16.2 * ln(LOC)
  const loc = Math.max(1, codeLines);
  const approxHalsteadVolume = Math.max(1, code.length * 0.7);
  let rawMI = 171 - 5.2 * Math.log(approxHalsteadVolume) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(loc);
  let maintainabilityIndex = Math.max(10, Math.min(100, Math.round((rawMI / 171) * 100)));

  // Transparent Quality Score Dimensions
  // 1. Readability (based on line lengths, comments, formatting)
  const commentRatio = totalLines > 0 ? (commentLines / totalLines) : 0;
  let readability = Math.min(100, Math.max(40, Math.round(75 + commentRatio * 50 - (maxNestingDepth > 4 ? (maxNestingDepth - 4) * 8 : 0))));

  // 2. Maintainability
  let maintainability = maintainabilityIndex;

  // 3. Complexity Score (lower cyclomatic complexity = higher score)
  let complexityScore = Math.max(30, Math.min(100, Math.round(100 - (cyclomaticComplexity - 1) * 4)));

  // 4. Documentation
  let documentationScore = Math.min(100, Math.max(20, Math.round(commentRatio * 200 + 40)));

  // 5. Duplication (heuristic check)
  const lineSet = new Set(lines.map(l => l.trim()).filter(l => l.length > 5));
  const duplicationRatio = lines.length > 0 ? 1 - (lineSet.size / lines.filter(l => l.trim().length > 5).length || 1) : 0;
  let duplicationScore = Math.max(50, Math.min(100, Math.round(100 - duplicationRatio * 60)));

  // Overall Weighted Quality Score
  const overall = Math.round(
    readability * 0.25 +
    maintainability * 0.25 +
    complexityScore * 0.20 +
    documentationScore * 0.15 +
    duplicationScore * 0.15
  );

  return {
    metrics: {
      lines: totalLines,
      characters: code.length,
      functions: Math.max(1, functionCount),
      classes: classCount,
      comments: commentLines,
      blankLines,
      cyclomaticComplexity,
      nestingDepth: maxNestingDepth,
      maintainabilityIndex,
    },
    qualityScore: {
      overall,
      breakdown: {
        readability,
        maintainability,
        complexity: complexityScore,
        documentation: documentationScore,
        duplication: duplicationScore,
      },
      formula: 'Weighted average: Readability (25%) + Maintainability (25%) + Complexity (20%) + Documentation (15%) + Duplication (15%)',
    },
  };
};
