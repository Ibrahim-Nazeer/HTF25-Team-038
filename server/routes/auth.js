const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sync user with database after Firebase authentication
router.post('/sync', async (req, res) => {
  try {
    const { id, email, name, role } = req.body;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
          role: role || 'INTERVIEWER'
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id },
        data: {
          name: name || user.name,
          email
        }
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role
router.patch('/user/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['INTERVIEWER', 'CANDIDATE'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;