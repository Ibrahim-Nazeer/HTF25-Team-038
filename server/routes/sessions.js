const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all sessions for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    const sessions = await prisma.interviewSession.findMany({
      where: {
        OR: [
          { interviewerId: userId },
          { candidateId: userId }
        ]
      },
      include: {
        interviewer: true,
        candidate: true,
        problem: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get a specific session by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.interviewSession.findUnique({
      where: { id },
      include: {
        interviewer: true,
        candidate: true,
        problem: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Create a new session
router.post('/', async (req, res) => {
  try {
    const { title, interviewerId, problemId, timerDuration } = req.body;

    // Generate Daily.co room (simplified for hackathon)
    const dailyRoomUrl = `https://codesync.daily.co/${Date.now()}`;

    const session = await prisma.interviewSession.create({
      data: {
        title,
        interviewerId,
        problemId: problemId || null,
        timerDuration: timerDuration || 45,
        dailyRoomUrl
      },
      include: {
        interviewer: true,
        problem: true
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session (e.g., add candidate)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { candidateId } = req.body;

    const session = await prisma.interviewSession.update({
      where: { id },
      data: { candidateId },
      include: {
        interviewer: true,
        candidate: true,
        problem: true
      }
    });

    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete a session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.interviewSession.delete({
      where: { id }
    });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;