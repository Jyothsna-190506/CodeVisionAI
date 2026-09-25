import * as parser from '@babel/parser';

export const generateAST = (code = '', language = 'cpp') => {
  const lang = language.toLowerCase();

  // JavaScript / TypeScript full Babel AST parser
  if (['javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx'].includes(lang)) {
    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
        errorRecovery: true,
      });

      const transformNode = (node, depth = 0) => {
        if (!node || typeof node !== 'object') return null;

        const transformed = {
          id: `ast_${Math.random().toString(36).substr(2, 9)}`,
          type: node.type || 'ASTNode',
          category: getNodeCategory(node.type),
          name: node.id?.name || node.name || node.key?.name || node.operator || (node.value !== undefined ? String(node.value) : ''),
          loc: node.loc ? { start: node.loc.start.line, end: node.loc.end.line, startCol: node.loc.start.column, endCol: node.loc.end.column } : undefined,
          snippet: node.loc ? code.split('\n').slice(node.loc.start.line - 1, node.loc.end.line).join('\n').trim() : '',
          depth,
          children: [],
        };

        if (node.body) {
          if (Array.isArray(node.body)) {
            transformed.children.push(...node.body.map(c => transformNode(c, depth + 1)).filter(Boolean));
          } else {
            const child = transformNode(node.body, depth + 1);
            if (child) transformed.children.push(child);
          }
        }

        if (node.declarations && Array.isArray(node.declarations)) {
          transformed.children.push(...node.declarations.map(d => transformNode(d, depth + 1)).filter(Boolean));
        }

        if (node.init) {
          const initChild = transformNode(node.init, depth + 1);
          if (initChild) transformed.children.push(initChild);
        }

        if (node.params && Array.isArray(node.params)) {
          transformed.children.push(...node.params.map(p => transformNode(p, depth + 1)).filter(Boolean));
        }

        if (node.consequent) {
          const child = transformNode(node.consequent, depth + 1);
          if (child) transformed.children.push(child);
        }

        if (node.alternate) {
          const child = transformNode(node.alternate, depth + 1);
          if (child) transformed.children.push(child);
        }

        return transformed;
      };

      const tree = transformNode(ast.program, 0);
      return {
        supported: true,
        tree,
        language: lang,
        totalNodes: countNodes(tree),
        maxDepth: getMaxDepth(tree),
      };
    } catch (err) {
      // Fall through to structural multi-language parser
    }
  }

  // Enhanced Universal Structural AST Generator for C++, Python, Java, Go, Rust, C#
  const lines = code.split('\n');
  const root = {
    id: 'root_program',
    type: 'Program',
    category: 'Root',
    name: `${language.toUpperCase()} TranslationUnit`,
    loc: { start: 1, end: lines.length },
    snippet: `// Total Lines: ${lines.length}`,
    depth: 0,
    children: [],
  };

  let currentContainer = root;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('#include') || trimmed.startsWith('import ') || trimmed.startsWith('using ')) {
      if (trimmed.startsWith('#include') || trimmed.startsWith('import ') || trimmed.startsWith('using ')) {
        root.children.push({
          id: `ast_inc_${lineNum}`,
          type: 'ImportDeclaration',
          category: 'Directive',
          name: trimmed,
          loc: { start: lineNum, end: lineNum },
          snippet: trimmed,
          depth: 1,
          children: [],
        });
      }
      return;
    }

    // Classes / Structs
    if (trimmed.match(/\b(class|struct)\s+(\w+)/)) {
      const match = trimmed.match(/\b(class|struct)\s+(\w+)/);
      const classNode = {
        id: `ast_class_${lineNum}`,
        type: 'ClassDeclaration',
        category: 'Declaration',
        name: `class ${match[2]}`,
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: 1,
        children: [],
      };
      root.children.push(classNode);
      currentContainer = classNode;
    }
    // Functions / Methods (e.g. int main(), def calculate(), void run())
    else if (trimmed.match(/\b(def|function|fn|func|public|private|protected|void|int|double|float|bool|char|auto)\s+(\w+)\s*\(/)) {
      const match = trimmed.match(/\b(def|function|fn|func|public|private|protected|void|int|double|float|bool|char|auto)\s+(\w+)\s*\(/);
      const funcName = match[2];
      const funcNode = {
        id: `ast_func_${lineNum}`,
        type: 'FunctionDeclaration',
        category: 'Function',
        name: `${funcName}()`,
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: currentContainer === root ? 1 : 2,
        children: [],
      };
      currentContainer.children.push(funcNode);
    }
    // Loops (for, while, do-while)
    else if (trimmed.match(/\b(for|while)\b/)) {
      const loopMatch = trimmed.match(/\((.*?)\)/)?.[1] || trimmed;
      const loopNode = {
        id: `ast_loop_${lineNum}`,
        type: 'ForStatement',
        category: 'Iteration',
        name: `for (${loopMatch.slice(0, 30)})`,
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: 2,
        children: [],
      };
      // Attach to nearest function or root
      const parent = currentContainer.children[currentContainer.children.length - 1] || currentContainer;
      if (parent.type === 'FunctionDeclaration') {
        parent.children.push(loopNode);
      } else {
        root.children.push(loopNode);
      }
    }
    // Conditionals (if, elif, else if)
    else if (trimmed.match(/\b(if|elif|else\s+if)\b/)) {
      const ifNode = {
        id: `ast_if_${lineNum}`,
        type: 'IfStatement',
        category: 'ControlFlow',
        name: trimmed.slice(0, 32),
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: 2,
        children: [],
      };
      const parent = currentContainer.children[currentContainer.children.length - 1] || currentContainer;
      if (parent.type === 'FunctionDeclaration') {
        parent.children.push(ifNode);
      } else {
        root.children.push(ifNode);
      }
    }
    // Variable Declarations & Assignments (e.g. int arr[] = {2, 4, 6}; int sum = 0;)
    else if (trimmed.includes('=') && !trimmed.includes('==')) {
      const assignNode = {
        id: `ast_assign_${lineNum}`,
        type: 'VariableDeclaration',
        category: 'Declaration',
        name: trimmed.replace(/;$/, ''),
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: 2,
        children: [],
      };
      const parent = currentContainer.children[currentContainer.children.length - 1] || currentContainer;
      if (parent.type === 'FunctionDeclaration') {
        parent.children.push(assignNode);
      } else {
        root.children.push(assignNode);
      }
    }
    // I/O & Call Expressions (cout << ..., print(...))
    else if (trimmed.match(/\b(cout|print|console\.log|printf|System\.out)\b/)) {
      const callNode = {
        id: `ast_call_${lineNum}`,
        type: 'CallExpression',
        category: 'Expression',
        name: trimmed.replace(/;$/, ''),
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: 2,
        children: [],
      };
      const parent = currentContainer.children[currentContainer.children.length - 1] || currentContainer;
      if (parent.type === 'FunctionDeclaration') {
        parent.children.push(callNode);
      } else {
        root.children.push(callNode);
      }
    }
    // Return statements
    else if (trimmed.match(/\b(return)\b/)) {
      const retNode = {
        id: `ast_ret_${lineNum}`,
        type: 'ReturnStatement',
        category: 'ControlFlow',
        name: trimmed.replace(/;$/, ''),
        loc: { start: lineNum, end: lineNum },
        snippet: trimmed,
        depth: 2,
        children: [],
      };
      const parent = currentContainer.children[currentContainer.children.length - 1] || currentContainer;
      if (parent.type === 'FunctionDeclaration') {
        parent.children.push(retNode);
      } else {
        root.children.push(retNode);
      }
    }
  });

  return {
    supported: true,
    tree: root,
    language: lang,
    totalNodes: countNodes(root),
    maxDepth: getMaxDepth(root),
  };
};

function getNodeCategory(type = '') {
  if (type.includes('Program') || type.includes('File')) return 'Root';
  if (type.includes('Function') || type.includes('Method')) return 'Function';
  if (type.includes('Class') || type.includes('Struct')) return 'Structure';
  if (type.includes('Declaration') || type.includes('Declarator')) return 'Declaration';
  if (type.includes('For') || type.includes('While') || type.includes('Loop')) return 'Iteration';
  if (type.includes('If') || type.includes('Switch') || type.includes('Return')) return 'ControlFlow';
  if (type.includes('Call') || type.includes('Binary') || type.includes('Expression')) return 'Expression';
  return 'Statement';
}

function countNodes(node) {
  if (!node) return 0;
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

function getMaxDepth(node, current = 1) {
  if (!node || !node.children || node.children.length === 0) return current;
  return Math.max(...node.children.map(c => getMaxDepth(c, current + 1)));
}

