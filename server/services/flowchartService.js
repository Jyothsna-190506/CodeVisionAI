export const generateFlowchart = (code = '', language = 'cpp') => {
  const nodes = [];
  const edges = [];
  let idCounter = 1;
  const lines = code.split('\n');

  const addNode = (label, type, codeSnippet = '', shape = 'rectangle', details = {}) => {
    const id = `node_${idCounter++}`;
    nodes.push({
      id,
      type: 'custom',
      shape, // 'pill' (start/end) | 'rectangle' (process) | 'diamond' (decision) | 'hexagon' (loop) | 'parallelogram' (io) | 'subroutine' (function)
      data: {
        id,
        label,
        nodeType: type, // 'start' | 'end' | 'process' | 'condition' | 'loop' | 'io' | 'function'
        code: codeSnippet,
        line: details.line || null,
        description: details.description || '',
        variables: details.variables || [],
      },
    });
    return id;
  };

  const addEdge = (source, target, label = '', type = 'smoothstep', animated = false) => {
    edges.push({
      id: `edge_${source}_${target}_${edges.length}`,
      source,
      target,
      label,
      type,
      animated,
      style: {
        stroke: label === 'True' ? '#10b981' : label === 'False' ? '#f43f5e' : '#6366f1',
        strokeWidth: 2,
      },
    });
  };

  const startId = addNode('Start Execution', 'start', 'Program entry point', 'pill', {
    description: 'Operating system initializes process stack and invokes entry routine.',
  });
  let prevId = startId;

  for (let i = 0; i < lines.length && nodes.length < 35; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    const lineNum = i + 1;

    if (!line || line.startsWith('//') || line.startsWith('#') || line.startsWith('/*')) continue;

    // Functions / Entry points
    if (line.match(/\b(def|function|public\s+void|int\s+main|void\s+main|const\s+\w+\s*=)\b/)) {
      const funcName = line.split('(')[0].split(/\s+/).pop() || 'main';
      const funcId = addNode(`Function: ${funcName}()`, 'function', line, 'subroutine', {
        line: lineNum,
        description: `Entry point subroutine allocation: ${funcName}`,
      });
      addEdge(prevId, funcId, 'Enter');
      prevId = funcId;
    }
    // For / While Loops
    else if (line.match(/\b(for|while)\b/)) {
      const loopCondition = line.match(/\((.*?)\)/)?.[1] || line;
      const loopId = addNode(`Loop: ${loopCondition.slice(0, 30)}`, 'loop', line, 'hexagon', {
        line: lineNum,
        description: 'Iterative control structure checking boundary predicate on each cycle.',
      });
      addEdge(prevId, loopId, 'Loop Init');
      prevId = loopId;
    }
    // Conditionals (if / else if)
    else if (line.match(/\b(if|elif|else\s+if)\b/)) {
      const cond = line.match(/\((.*?)\)/)?.[1] || line;
      const condId = addNode(`Decision: ${cond.slice(0, 28)}?`, 'condition', line, 'diamond', {
        line: lineNum,
        description: 'Conditional branch predicate evaluating Boolean expression.',
      });
      addEdge(prevId, condId, 'Evaluate');
      prevId = condId;
    }
    // I/O (cout, print, console.log, cin)
    else if (line.match(/\b(print|cout|System\.out|console\.log|input|scanf|cin)\b/)) {
      const ioId = addNode(`I/O: ${line.slice(0, 32)}`, 'io', line, 'parallelogram', {
        line: lineNum,
        description: 'Standard stream Input/Output channel transmission.',
      });
      addEdge(prevId, ioId, 'Output');
      prevId = ioId;
    }
    // Return statements
    else if (line.match(/\b(return|exit)\b/)) {
      const retId = addNode(`Return: ${line.slice(0, 25)}`, 'end', line, 'pill', {
        line: lineNum,
        description: 'Terminates active frame and returns status code to caller.',
      });
      addEdge(prevId, retId, 'Terminate');
      prevId = retId;
    }
    // Variable Declarations & Assignments
    else if (line.includes('=') && !line.includes('==')) {
      const procId = addNode(`Assign: ${line.slice(0, 32)}`, 'process', line, 'rectangle', {
        line: lineNum,
        description: 'Allocates/updates scalar or contiguous variable in local stack memory.',
      });
      addEdge(prevId, procId, 'Compute');
      prevId = procId;
    }
  }

  const endId = addNode('End Program', 'end', 'Process termination (Exit Code 0)', 'pill', {
    description: 'Process stack unallocated and execution halts.',
  });
  addEdge(prevId, endId, 'Done');

  return {
    nodes,
    edges,
    totalNodes: nodes.length,
    totalEdges: edges.length,
    supported: true,
  };
};

