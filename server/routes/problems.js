const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const leetcode75Part1 = require('../data/leetcode75-part1');
const leetcode75Part2 = require('../data/leetcode75-part2');

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
    const { title, description, difficulty, category, starterCode, testCases, functionName } = req.body;

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        category,
        starterCode: starterCode || null,
        testCases: testCases || null,
        functionName: functionName || null
      }
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ error: 'Failed to create problem' });
  }
});

// Seed LeetCode 75 problems
router.post('/seed-leetcode75', async (req, res) => {
  try {
    const allProblems = [...leetcode75Part1, ...leetcode75Part2];
    const { force } = req.query;
    
    // Check if problems already exist
    const existingCount = await prisma.problem.count();
    if (existingCount > 0 && !force) {
      return res.json({ 
        message: 'Problems already seeded', 
        count: existingCount,
        hint: 'Add ?force=true to delete existing problems and reseed'
      });
    }

    // If force, delete all existing problems
    if (force === 'true') {
      await prisma.problem.deleteMany({});
      console.log('Deleted all existing problems');
    }

    const problems = await Promise.all(
      allProblems.map(problem =>
        prisma.problem.create({ 
          data: {
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            category: problem.category,
            starterCode: problem.starterCode,
            testCases: problem.testCases,
            functionName: problem.functionName
          }
        })
      )
    );

    res.json({ 
      message: 'LeetCode 75 problems seeded successfully', 
      count: problems.length,
      problems 
    });
  } catch (error) {
    console.error('Error seeding LeetCode 75:', error);
    res.status(500).json({ error: 'Failed to seed problems', details: error.message });
  }
});

module.exports = router;