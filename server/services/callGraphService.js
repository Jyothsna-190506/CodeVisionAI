export const generateCallGraph = (code = '', language = 'python') => {
  const lines = code.split('\n');
  const definedFunctions = new Map(); // name -> { line, calls: Set }
  const allCalls = [];

  // 1. Find defined functions
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Match function definition
    const defMatch = trimmed.match(
      /\b(def|function|fn|func|public\s+\w+|private\s+\w+|void|int|double|String|auto)\s+([a-zA-Z_]\w*)\s*\(/
    );

    if (defMatch) {
      const funcName = defMatch[2];
      if (!['if', 'for', 'while', 'switch', 'catch'].includes(funcName)) {
        definedFunctions.set(funcName, { line: lineNum, calls: new Set() });
      }
    }
  });

  // Always ensure at least entry function if none detected
  if (definedFunctions.size === 0) {
    definedFunctions.set('main', { line: 1, calls: new Set() });
  }

  // 2. Find function invocations inside code
  const funcNames = Array.from(definedFunctions.keys());
  let currentFunc = funcNames[0] || 'main';

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check if we entered a new function
    for (const [name, info] of definedFunctions.entries()) {
      if (trimmed.includes(name) && trimmed.includes('(') && (trimmed.includes('def') || trimmed.includes('function') || trimmed.includes('{') || trimmed.endsWith(':'))) {
        currentFunc = name;
        break;
      }
    }

    // Check calls to other known functions or builtins
    const callMatches = trimmed.match(/\b([a-zA-Z_]\w*)\s*\(/g);
    if (callMatches) {
      callMatches.forEach((match) => {
        const callee = match.replace(/\s*\(/, '').trim();
        if (
          callee !== currentFunc &&
          !['if', 'for', 'while', 'switch', 'catch', 'sizeof', 'typeof'].includes(callee)
        ) {
          if (definedFunctions.has(currentFunc)) {
            definedFunctions.get(currentFunc).calls.add(callee);
          }
          allCalls.push({ caller: currentFunc, callee, line: idx + 1 });
        }
      });
    }
  });

  // Build nodes and edges
  const nodes = [];
  const edges = [];
  const relationships = [];
  let index = 0;

  for (const [name, info] of definedFunctions.entries()) {
    nodes.push({
      id: name,
      label: `${name}()`,
      line: info.line,
      type: name === 'main' ? 'entry' : 'function',
      callCount: Array.from(info.calls).length,
    });

    for (const callee of info.calls) {
      edges.push({
        id: `call_${name}_${callee}_${index++}`,
        source: name,
        target: callee,
        label: 'invokes',
      });

      relationships.push({
        caller: name,
        callee: callee,
        type: 'direct_call',
      });
    }
  }

  // Add external/builtin targets to nodes if not present
  const existingNodeIds = new Set(nodes.map(n => n.id));
  edges.forEach((edge) => {
    if (!existingNodeIds.has(edge.target)) {
      nodes.push({
        id: edge.target,
        label: `${edge.target}() [external]`,
        line: 0,
        type: 'external',
        callCount: 0,
      });
      existingNodeIds.add(edge.target);
    }
  });

  return {
    nodes,
    edges,
    relationships,
  };
};
