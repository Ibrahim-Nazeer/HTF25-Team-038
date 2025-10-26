const leetcode75Part2 = [
  {
    title: "Invert Binary Tree",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    difficulty: "EASY",
    category: "Binary Tree",
    functionName: "invertTree",
    starterCode: {
      javascript: `function invertTree(root) {
  // Your code here
  
}`,
      python: `def invertTree(root):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[4,2,7,1,3,6,9]], expected: [4,7,2,9,6,3,1], hidden: false },
      { input: [[2,1,3]], expected: [2,3,1], hidden: false }
    ]
  },
  {
    title: "Maximum Depth of Binary Tree",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    difficulty: "EASY",
    category: "Binary Tree",
    functionName: "maxDepth",
    starterCode: {
      javascript: `function maxDepth(root) {
  // Your code here
  
}`,
      python: `def maxDepth(root):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[3,9,20,null,null,15,7]], expected: 3, hidden: false },
      { input: [[1,null,2]], expected: 2, hidden: false }
    ]
  },
  {
    title: "Same Tree",
    description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
    difficulty: "EASY",
    category: "Binary Tree",
    functionName: "isSameTree",
    starterCode: {
      javascript: `function isSameTree(p, q) {
  // Your code here
  
}`,
      python: `def isSameTree(p, q):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3], [1,2,3]], expected: true, hidden: false },
      { input: [[1,2], [1,null,2]], expected: false, hidden: false }
    ]
  },
  {
    title: "Subtree of Another Tree",
    description: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.",
    difficulty: "EASY",
    category: "Binary Tree",
    functionName: "isSubtree",
    starterCode: {
      javascript: `function isSubtree(root, subRoot) {
  // Your code here
  
}`,
      python: `def isSubtree(root, subRoot):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[3,4,5,1,2], [4,1,2]], expected: true, hidden: false },
      { input: [[3,4,5,1,2,null,null,null,null,0], [4,1,2]], expected: false, hidden: false }
    ]
  },
  {
    title: "Lowest Common Ancestor of BST",
    description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
    difficulty: "MEDIUM",
    category: "Binary Tree",
    functionName: "lowestCommonAncestor",
    starterCode: {
      javascript: `function lowestCommonAncestor(root, p, q) {
  // Your code here
  
}`,
      python: `def lowestCommonAncestor(root, p, q):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[6,2,8,0,4,7,9,null,null,3,5], 2, 8], expected: 6, hidden: false },
      { input: [[6,2,8,0,4,7,9,null,null,3,5], 2, 4], expected: 2, hidden: false }
    ]
  },
  {
    title: "Binary Tree Level Order Traversal",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    difficulty: "MEDIUM",
    category: "Binary Tree",
    functionName: "levelOrder",
    starterCode: {
      javascript: `function levelOrder(root) {
  // Your code here (BFS)
  
}`,
      python: `def levelOrder(root):
    # Your code here (BFS)
    pass`
    },
    testCases: [
      { input: [[3,9,20,null,null,15,7]], expected: [[3],[9,20],[15,7]], hidden: false },
      { input: [[1]], expected: [[1]], hidden: false }
    ]
  },
  {
    title: "Validate Binary Search Tree",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    difficulty: "MEDIUM",
    category: "Binary Tree",
    functionName: "isValidBST",
    starterCode: {
      javascript: `function isValidBST(root) {
  // Your code here
  
}`,
      python: `def isValidBST(root):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[2,1,3]], expected: true, hidden: false },
      { input: [[5,1,4,null,null,3,6]], expected: false, hidden: false }
    ]
  },
  {
    title: "Kth Smallest Element in a BST",
    description: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    difficulty: "MEDIUM",
    category: "Binary Tree",
    functionName: "kthSmallest",
    starterCode: {
      javascript: `function kthSmallest(root, k) {
  // Your code here (In-order traversal)
  
}`,
      python: `def kthSmallest(root, k):
    # Your code here (In-order traversal)
    pass`
    },
    testCases: [
      { input: [[3,1,4,null,2], 1], expected: 1, hidden: false },
      { input: [[5,3,6,2,4,null,null,1], 3], expected: 3, hidden: false }
    ]
  },
  {
    title: "Binary Tree Maximum Path Sum",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. The path sum of a path is the sum of the node's values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
    difficulty: "HARD",
    category: "Binary Tree",
    functionName: "maxPathSum",
    starterCode: {
      javascript: `function maxPathSum(root) {
  // Your code here
  
}`,
      python: `def maxPathSum(root):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3]], expected: 6, hidden: false },
      { input: [[-10,9,20,null,null,15,7]], expected: 42, hidden: false }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    category: "Dynamic Programming",
    functionName: "climbStairs",
    starterCode: {
      javascript: `function climbStairs(n) {
  // Your code here
  
}`,
      python: `def climbStairs(n):
    # Your code here
    pass`
    },
    testCases: [
      { input: [2], expected: 2, hidden: false },
      { input: [3], expected: 3, hidden: false },
      { input: [5], expected: 8, hidden: true }
    ]
  },
  {
    title: "House Robber",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses are arranged in a circle. Adjacent houses have a security system connected that will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    functionName: "rob",
    starterCode: {
      javascript: `function rob(nums) {
  // Your code here
  
}`,
      python: `def rob(nums):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3,1]], expected: 4, hidden: false },
      { input: [[2,7,9,3,1]], expected: 12, hidden: false }
    ]
  },
  {
    title: "Longest Palindromic Substring",
    description: "Given a string s, return the longest palindromic substring in s.",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    functionName: "longestPalindrome",
    starterCode: {
      javascript: `function longestPalindrome(s) {
  // Your code here
  
}`,
      python: `def longestPalindrome(s):
    # Your code here
    pass`
    },
    testCases: [
      { input: ["babad"], expected: "bab", hidden: false },
      { input: ["cbbd"], expected: "bb", hidden: false }
    ]
  },
  {
    title: "Coin Change",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    functionName: "coinChange",
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Your code here
  
}`,
      python: `def coinChange(coins, amount):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,5], 11], expected: 3, hidden: false },
      { input: [[2], 3], expected: -1, hidden: false },
      { input: [[1], 0], expected: 0, hidden: true }
    ]
  },
  {
    title: "Longest Increasing Subsequence",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    functionName: "lengthOfLIS",
    starterCode: {
      javascript: `function lengthOfLIS(nums) {
  // Your code here
  
}`,
      python: `def lengthOfLIS(nums):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[10,9,2,5,3,7,101,18]], expected: 4, hidden: false },
      { input: [[0,1,0,3,2,3]], expected: 4, hidden: false }
    ]
  },
  {
    title: "Word Break",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    functionName: "wordBreak",
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
  // Your code here
  
}`,
      python: `def wordBreak(s, wordDict):
    # Your code here
    pass`
    },
    testCases: [
      { input: ["leetcode", ["leet","code"]], expected: true, hidden: false },
      { input: ["applepenapple", ["apple","pen"]], expected: true, hidden: false },
      { input: ["catsandog", ["cats","dog","sand","and","cat"]], expected: false, hidden: true }
    ]
  },
  {
    title: "Combination Sum",
    description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.",
    difficulty: "MEDIUM",
    category: "Backtracking",
    functionName: "combinationSum",
    starterCode: {
      javascript: `function combinationSum(candidates, target) {
  // Your code here
  
}`,
      python: `def combinationSum(candidates, target):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[2,3,6,7], 7], expected: [[2,2,3],[7]], hidden: false },
      { input: [[2,3,5], 8], expected: [[2,2,2,2],[2,3,3],[3,5]], hidden: false }
    ]
  },
  {
    title: "Number of Islands",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    difficulty: "MEDIUM",
    category: "Graph",
    functionName: "numIslands",
    starterCode: {
      javascript: `function numIslands(grid) {
  // Your code here (DFS or BFS)
  
}`,
      python: `def numIslands(grid):
    # Your code here (DFS or BFS)
    pass`
    },
    testCases: [
      { input: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1, hidden: false },
      { input: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3, hidden: false }
    ]
  },
  {
    title: "Clone Graph",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    difficulty: "MEDIUM",
    category: "Graph",
    functionName: "cloneGraph",
    starterCode: {
      javascript: `function cloneGraph(node) {
  // Your code here
  
}`,
      python: `def cloneGraph(node):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[[2,4],[1,3],[2,4],[1,3]]], expected: [[2,4],[1,3],[2,4],[1,3]], hidden: false }
    ]
  },
  {
    title: "Course Schedule",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
    difficulty: "MEDIUM",
    category: "Graph",
    functionName: "canFinish",
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  // Your code here (Topological sort)
  
}`,
      python: `def canFinish(numCourses, prerequisites):
    # Your code here (Topological sort)
    pass`
    },
    testCases: [
      { input: [2, [[1,0]]], expected: true, hidden: false },
      { input: [2, [[1,0],[0,1]]], expected: false, hidden: false }
    ]
  },
  {
    title: "Pacific Atlantic Water Flow",
    description: "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Return a 2D list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.",
    difficulty: "MEDIUM",
    category: "Graph",
    functionName: "pacificAtlantic",
    starterCode: {
      javascript: `function pacificAtlantic(heights) {
  // Your code here
  
}`,
      python: `def pacificAtlantic(heights):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]], expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]], hidden: false }
    ]
  }
];

module.exports = leetcode75Part2;
