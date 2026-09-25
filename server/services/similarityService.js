// Semantic & Algorithmic Code Pattern Database
const CODE_KNOWLEDGE_BASE = [
  {
    repository: 'github.com/TheAlgorithms/Python',
    language: 'python',
    functionName: 'binary_search',
    category: 'Searching',
    code: `def binary_search(array, target):\n    low, high = 0, len(array) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if array[mid] == target:\n            return mid\n        elif array[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
    explanation: 'Classic logarithmic O(log n) divide-and-conquer binary search on sorted sequences.',
  },
  {
    repository: 'github.com/TheAlgorithms/Python',
    language: 'python',
    functionName: 'quick_sort',
    category: 'Sorting',
    code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)`,
    explanation: 'Divide and conquer pivot partitioning with average O(n log n) runtime.',
  },
  {
    repository: 'github.com/TheAlgorithms/Java',
    language: 'java',
    functionName: 'MergeSort',
    category: 'Sorting',
    code: `public static void mergeSort(int[] array, int left, int right) {\n    if (left < right) {\n        int mid = (left + right) / 2;\n        mergeSort(array, left, mid);\n        mergeSort(array, mid + 1, right);\n        merge(array, left, mid, right);\n    }\n}`,
    explanation: 'Stable merge sort with deterministic O(n log n) time complexity and O(n) auxiliary space.',
  },
  {
    repository: 'github.com/TheAlgorithms/C-Plus-Plus',
    language: 'cpp',
    functionName: 'fibonacci_dp',
    category: 'Dynamic Programming',
    code: `int fibonacci(int n) {\n    if (n <= 1) return n;\n    vector<int> dp(n + 1);\n    dp[0] = 0; dp[1] = 1;\n    for (int i = 2; i <= n; i++) {\n        dp[i] = dp[i - 1] + dp[i - 2];\n    }\n    return dp[n];\n}`,
    explanation: 'Bottom-up memoized tabular dynamic programming eliminating exponential recursion redundancy.',
  },
  {
    repository: 'github.com/TheAlgorithms/JavaScript',
    language: 'javascript',
    functionName: 'depthFirstSearch',
    category: 'Graph',
    code: `function dfs(graph, startNode, visited = new Set()) {\n    visited.add(startNode);\n    for (const neighbor of graph[startNode] || []) {\n        if (!visited.has(neighbor)) {\n            dfs(graph, neighbor, visited);\n        }\n    }\n    return visited;\n}`,
    explanation: 'Recursive graph exploration tracking visited set to traverse connected components.',
  },
  {
    repository: 'github.com/TheAlgorithms/Python',
    language: 'python',
    functionName: 'two_sum',
    category: 'Hash Map / Two Pointer',
    code: `def two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []`,
    explanation: 'Single-pass hash table lookups resolving pair sums in linear O(n) time.',
  },
];

export const findSimilarCode = (code = '', language = 'python') => {
  const lowerCode = code.toLowerCase();
  const lowerLang = language.toLowerCase();

  const results = CODE_KNOWLEDGE_BASE.map((item) => {
    let score = 50; // base score

    // Language match bonus
    if (item.language === lowerLang) score += 20;

    // Token & keyword overlap
    const keywords = ['sort', 'search', 'binary', 'dp', 'fib', 'graph', 'dfs', 'bfs', 'tree', 'sum', 'array', 'loop'];
    keywords.forEach((kw) => {
      if (lowerCode.includes(kw) && (item.code.toLowerCase().includes(kw) || item.functionName.toLowerCase().includes(kw))) {
        score += 8;
      }
    });

    // Control flow similarity (recursion, loops)
    if (lowerCode.includes('while') && item.code.includes('while')) score += 5;
    if (lowerCode.includes('for') && item.code.includes('for')) score += 5;

    const boundedScore = Math.min(98, Math.max(55, score));

    return {
      repository: item.repository,
      language: item.language,
      functionName: item.functionName,
      similarityScore: boundedScore,
      code: item.code,
      explanation: item.explanation,
      category: item.category,
    };
  });

  // Sort by similarity score descending
  results.sort((a, b) => b.similarityScore - a.similarityScore);

  return results.slice(0, 3);
};
