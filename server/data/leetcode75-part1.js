const leetcode75Problems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "EASY",
    category: "Array",
    functionName: "twoSum",
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
  
}`,
      python: `def twoSum(nums, target):
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], hidden: false, description: "Basic case" },
      { input: [[3, 2, 4], 6], expected: [1, 2], hidden: false, description: "Middle elements" },
      { input: [[3, 3], 6], expected: [0, 1], hidden: true, description: "Duplicate numbers" }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
    difficulty: "EASY",
    category: "Array",
    functionName: "maxProfit",
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Your code here
  
}`,
      python: `def maxProfit(prices):
    # Your code here
    pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here
        return 0;
    }
}`
    },
    testCases: [
      { input: [[7,1,5,3,6,4]], expected: 5, hidden: false, description: "Buy at 1, sell at 6" },
      { input: [[7,6,4,3,1]], expected: 0, hidden: false, description: "No profit possible" }
    ]
  },
  {
    title: "Contains Duplicate",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficulty: "EASY",
    category: "Array",
    functionName: "containsDuplicate",
    starterCode: {
      javascript: `function containsDuplicate(nums) {
  // Your code here
  
}`,
      python: `def containsDuplicate(nums):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3,1]], expected: true, hidden: false },
      { input: [[1,2,3,4]], expected: false, hidden: false },
      { input: [[1,1,1,3,3,4,3,2,4,2]], expected: true, hidden: true }
    ]
  },
  {
    title: "Product of Array Except Self",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
    difficulty: "MEDIUM",
    category: "Array",
    functionName: "productExceptSelf",
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Your code here
  
}`,
      python: `def productExceptSelf(nums):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3,4]], expected: [24,12,8,6], hidden: false },
      { input: [[-1,1,0,-3,3]], expected: [0,0,9,0,0], hidden: true }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    difficulty: "MEDIUM",
    category: "Array",
    functionName: "maxSubArray",
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Your code here (Kadane's Algorithm)
  
}`,
      python: `def maxSubArray(nums):
    # Your code here (Kadane's Algorithm)
    pass`
    },
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6, hidden: false, description: "Subarray [4,-1,2,1]" },
      { input: [[1]], expected: 1, hidden: false },
      { input: [[5,4,-1,7,8]], expected: 23, hidden: true }
    ]
  },
  {
    title: "3Sum",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    difficulty: "MEDIUM",
    category: "Array",
    functionName: "threeSum",
    starterCode: {
      javascript: `function threeSum(nums) {
  // Your code here
  
}`,
      python: `def threeSum(nums):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]], hidden: false },
      { input: [[0,1,1]], expected: [], hidden: false },
      { input: [[0,0,0]], expected: [[0,0,0]], hidden: true }
    ]
  },
  {
    title: "Container With Most Water",
    description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    difficulty: "MEDIUM",
    category: "Array",
    functionName: "maxArea",
    starterCode: {
      javascript: `function maxArea(height) {
  // Your code here (Two pointers)
  
}`,
      python: `def maxArea(height):
    # Your code here (Two pointers)
    pass`
    },
    testCases: [
      { input: [[1,8,6,2,5,4,8,3,7]], expected: 49, hidden: false },
      { input: [[1,1]], expected: 1, hidden: false }
    ]
  },
  {
    title: "Valid Palindrome",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "EASY",
    category: "String",
    functionName: "isPalindrome",
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Your code here
  
}`,
      python: `def isPalindrome(s):
    # Your code here
    pass`
    },
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, hidden: false },
      { input: ["race a car"], expected: false, hidden: false },
      { input: [" "], expected: true, hidden: true }
    ]
  },
  {
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    difficulty: "EASY",
    category: "String",
    functionName: "isAnagram",
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Your code here
  
}`,
      python: `def isAnagram(s, t):
    # Your code here
    pass`
    },
    testCases: [
      { input: ["anagram", "nagaram"], expected: true, hidden: false },
      { input: ["rat", "car"], expected: false, hidden: false }
    ]
  },
  {
    title: "Group Anagrams",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    difficulty: "MEDIUM",
    category: "String",
    functionName: "groupAnagrams",
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Your code here
  
}`,
      python: `def groupAnagrams(strs):
    # Your code here
    pass`
    },
    testCases: [
      { input: [["eat","tea","tan","ate","nat","bat"]], expected: [["bat"],["nat","tan"],["ate","eat","tea"]], hidden: false }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "MEDIUM",
    category: "String",
    functionName: "lengthOfLongestSubstring",
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Your code here (Sliding window)
  
}`,
      python: `def lengthOfLongestSubstring(s):
    # Your code here (Sliding window)
    pass`
    },
    testCases: [
      { input: ["abcabcbb"], expected: 3, hidden: false, description: "abc" },
      { input: ["bbbbb"], expected: 1, hidden: false },
      { input: ["pwwkew"], expected: 3, hidden: true, description: "wke" }
    ]
  },
  {
    title: "Longest Repeating Character Replacement",
    description: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
    difficulty: "MEDIUM",
    category: "String",
    functionName: "characterReplacement",
    starterCode: {
      javascript: `function characterReplacement(s, k) {
  // Your code here
  
}`,
      python: `def characterReplacement(s, k):
    # Your code here
    pass`
    },
    testCases: [
      { input: ["ABAB", 2], expected: 4, hidden: false },
      { input: ["AABABBA", 1], expected: 4, hidden: false }
    ]
  },
  {
    title: "Minimum Window Substring",
    description: "Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.",
    difficulty: "HARD",
    category: "String",
    functionName: "minWindow",
    starterCode: {
      javascript: `function minWindow(s, t) {
  // Your code here (Sliding window)
  
}`,
      python: `def minWindow(s, t):
    # Your code here (Sliding window)
    pass`
    },
    testCases: [
      { input: ["ADOBECODEBANC", "ABC"], expected: "BANC", hidden: false },
      { input: ["a", "a"], expected: "a", hidden: false },
      { input: ["a", "aa"], expected: "", hidden: true }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets and in the correct order.",
    difficulty: "EASY",
    category: "Stack",
    functionName: "isValid",
    starterCode: {
      javascript: `function isValid(s) {
  // Your code here
  
}`,
      python: `def isValid(s):
    # Your code here
    pass`
    },
    testCases: [
      { input: ["()"], expected: true, hidden: false },
      { input: ["()[]{}"], expected: true, hidden: false },
      { input: ["(]"], expected: false, hidden: false },
      { input: ["([)]"], expected: false, hidden: true },
      { input: ["{[]}"], expected: true, hidden: true }
    ]
  },
  {
    title: "Min Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    difficulty: "MEDIUM",
    category: "Stack",
    functionName: "MinStack",
    starterCode: {
      javascript: `class MinStack {
  constructor() {
    // Your code here
  }
  
  push(val) {
    // Your code here
  }
  
  pop() {
    // Your code here
  }
  
  top() {
    // Your code here
  }
  
  getMin() {
    // Your code here
  }
}`,
      python: `class MinStack:
    def __init__(self):
        # Your code here
        pass
    
    def push(self, val):
        # Your code here
        pass
    
    def pop(self):
        # Your code here
        pass
    
    def top(self):
        # Your code here
        pass
    
    def getMin(self):
        # Your code here
        pass`
    },
    testCases: [
      { input: [["MinStack","push","push","push","getMin","pop","top","getMin"],[[],[-2],[0],[-3],[],[],[],[]]], expected: [null,null,null,null,-3,null,0,-2], hidden: false }
    ]
  },
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "EASY",
    category: "Linked List",
    functionName: "reverseList",
    starterCode: {
      javascript: `function reverseList(head) {
  // Your code here
  
}`,
      python: `def reverseList(head):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3,4,5]], expected: [5,4,3,2,1], hidden: false },
      { input: [[1,2]], expected: [2,1], hidden: false },
      { input: [[]], expected: [], hidden: true }
    ]
  },
  {
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    difficulty: "EASY",
    category: "Linked List",
    functionName: "mergeTwoLists",
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Your code here
  
}`,
      python: `def mergeTwoLists(list1, list2):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4], hidden: false },
      { input: [[], []], expected: [], hidden: false }
    ]
  },
  {
    title: "Linked List Cycle",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    difficulty: "EASY",
    category: "Linked List",
    functionName: "hasCycle",
    starterCode: {
      javascript: `function hasCycle(head) {
  // Your code here (Floyd's cycle detection)
  
}`,
      python: `def hasCycle(head):
    # Your code here (Floyd's cycle detection)
    pass`
    },
    testCases: [
      { input: [[3,2,0,-4], 1], expected: true, hidden: false },
      { input: [[1,2], 0], expected: true, hidden: false },
      { input: [[1], -1], expected: false, hidden: true }
    ]
  },
  {
    title: "Remove Nth Node From End of List",
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    difficulty: "MEDIUM",
    category: "Linked List",
    functionName: "removeNthFromEnd",
    starterCode: {
      javascript: `function removeNthFromEnd(head, n) {
  // Your code here
  
}`,
      python: `def removeNthFromEnd(head, n):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3,4,5], 2], expected: [1,2,3,5], hidden: false },
      { input: [[1], 1], expected: [], hidden: false }
    ]
  },
  {
    title: "Reorder List",
    description: "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …",
    difficulty: "MEDIUM",
    category: "Linked List",
    functionName: "reorderList",
    starterCode: {
      javascript: `function reorderList(head) {
  // Your code here
  
}`,
      python: `def reorderList(head):
    # Your code here
    pass`
    },
    testCases: [
      { input: [[1,2,3,4]], expected: [1,4,2,3], hidden: false },
      { input: [[1,2,3,4,5]], expected: [1,5,2,4,3], hidden: false }
    ]
  }
];

module.exports = leetcode75Problems;
