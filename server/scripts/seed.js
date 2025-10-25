// /server/scripts/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleProblems = [
  {
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: 'EASY',
    starterCode: `function twoSum(nums, target) {
  // Your code here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]`
  },
  {
    title: 'Reverse Linked List',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]`,
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

// Test helper
function arrayToList(arr) {
  let dummy = new ListNode(0);
  let current = dummy;
  for (let val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}

// Test
const list = arrayToList([1, 2, 3, 4, 5]);
console.log(reverseList(list));`
  },
  {
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example:
Input: s = "()[]{}"
Output: true`,
    difficulty: 'EASY',
    starterCode: `function isValid(s) {
  // Your code here
  
}

// Test cases
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false
console.log(isValid("([)]")); // false`
  },
  {
    title: 'Implement LRU Cache',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if exists, otherwise return -1.
- void put(int key, int value) Update the value of the key if exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds capacity, evict the least recently used key.

The functions get and put must each run in O(1) average time complexity.`,
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

// Test
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3);
console.log(cache.get(2)); // -1`
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

Example:
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.`,
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

// Test
const tree = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log(maxPathSum(tree)); // Expected: 6`
  },
  {
    title: 'Merge Intervals',
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].`,
    difficulty: 'MEDIUM',
    starterCode: `function merge(intervals) {
  // Your code here
  
}

// Test cases
console.log(merge([[1,3],[2,6],[8,10],[15,18]])); 
// Expected: [[1,6],[8,10],[15,18]]

console.log(merge([[1,4],[4,5]])); 
// Expected: [[1,5]]`
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing problems
    await prisma.problem.deleteMany({});
    console.log('✅ Cleared existing problems');

    // Create sample problems
    for (const problem of sampleProblems) {
      await prisma.problem.create({
        data: problem
      });
      console.log(`✅ Created problem: ${problem.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${sampleProblems.length} problems!`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });