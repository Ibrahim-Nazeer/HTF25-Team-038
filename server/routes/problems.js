const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get a specific problem by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id }
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

// Create a new problem (for admin/seeding)
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, starterCode } = req.body;

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        starterCode: starterCode || null
      }
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ error: 'Failed to create problem' });
  }
});

// Seed initial problems (for hackathon demo)
router.post('/seed', async (req, res) => {
  try {
    const sampleProblems = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'EASY',
        starterCode: `function twoSum(nums, target) {
  // Your code here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`
      },
      {
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'MEDIUM',
        starterCode: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  // Your code here
  
}

// Test cases
const list = new ListNode(1, new ListNode(2, new ListNode(3)));
console.log(reverseList(list));`
      },
      {
        title: 'Binary Tree Maximum Path Sum',
        description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Find the maximum path sum of any non-empty path.',
        difficulty: 'HARD',
        starterCode: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxPathSum(root) {
  // Your code here
  
}

// Test cases
const tree = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log(maxPathSum(tree)); // Expected: 6`
      },
      {
        title: 'Implement a LRU Cache',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with get and put operations in O(1) time complexity.',
        difficulty: 'MEDIUM',
        starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    // Your implementation
  }

  get(key) {
    // Your code here
  }

  put(key, value) {
    // Your code here
  }
}

// Test cases
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // Expected: 1`
      },
      {
        title: 'Valid Parentheses',
        description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'EASY',
        starterCode: `function isValid(s) {
  // Your code here
  
}

// Test cases
console.log(isValid("()")); // Expected: true
console.log(isValid("()[]{}")); // Expected: true
console.log(isValid("(]")); // Expected: false`
      }
    ];

    const problems = await Promise.all(
      sampleProblems.map(problem =>
        prisma.problem.create({ data: problem })
      )
    );

    res.json({ 
      message: 'Problems seeded successfully', 
      count: problems.length,
      problems 
    });
  } catch (error) {
    console.error('Error seeding problems:', error);
    res.status(500).json({ error: 'Failed to seed problems' });
  }
});

module.exports = router;