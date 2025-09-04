
const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');

// Get all savings goals for a specific user
router.get('/', async (req, res) => {
  try {
    // In a real app, you would get the userId from JWT auth middleware
    const userId = req.query.userId || 'demo-user';
    
    const savingsGoals = await SavingsGoal.find({ userId });
    res.json(savingsGoals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new savings goal
router.post('/', async (req, res) => {
  const savingsGoal = new SavingsGoal({
    name: req.body.name,
    targetAmount: req.body.targetAmount,
    currentAmount: req.body.currentAmount || 0,
    deadline: req.body.deadline,
    userId: req.body.userId || 'demo-user'
  });

  try {
    const newSavingsGoal = await savingsGoal.save();
    res.status(201).json(newSavingsGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific savings goal
router.get('/:id', async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findById(req.params.id);
    if (!savingsGoal) return res.status(404).json({ message: 'Savings goal not found' });
    res.json(savingsGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a savings goal
router.put('/:id', async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findById(req.params.id);
    if (!savingsGoal) return res.status(404).json({ message: 'Savings goal not found' });
    
    if (req.body.name) savingsGoal.name = req.body.name;
    if (req.body.targetAmount) savingsGoal.targetAmount = req.body.targetAmount;
    if (req.body.currentAmount !== undefined) savingsGoal.currentAmount = req.body.currentAmount;
    if (req.body.deadline) savingsGoal.deadline = req.body.deadline;
    
    const updatedSavingsGoal = await savingsGoal.save();
    res.json(updatedSavingsGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add contribution to a savings goal
router.post('/:id/contribute', async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findById(req.params.id);
    if (!savingsGoal) return res.status(404).json({ message: 'Savings goal not found' });
    
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid contribution amount is required' });
    }
    
    savingsGoal.currentAmount += amount;
    
    const updatedSavingsGoal = await savingsGoal.save();
    res.json(updatedSavingsGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a savings goal
router.delete('/:id', async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findById(req.params.id);
    if (!savingsGoal) return res.status(404).json({ message: 'Savings goal not found' });
    
    await savingsGoal.deleteOne();
    res.json({ message: 'Savings goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
