
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// Get all budgets for a specific user
router.get('/', async (req, res) => {
  try {
    // In a real app, you would get the userId from JWT auth middleware
    const userId = req.query.userId || 'demo-user';
    
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new budget
router.post('/', async (req, res) => {
  const budget = new Budget({
    category: req.body.category,
    amount: req.body.amount,
    period: req.body.period,
    spent: req.body.spent || 0,
    userId: req.body.userId || 'demo-user'
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Calculate spent amounts for each budget
router.get('/calculate', async (req, res) => {
  try {
    const userId = req.query.userId || 'demo-user';
    
    // Get all budgets
    const budgets = await Budget.find({ userId });
    
    // For each budget, calculate the sum of expenses in that category
    const currentDate = new Date();
    const results = [];
    
    for (const budget of budgets) {
      let startDate;
      const endDate = new Date();
      
      // Determine the start date based on the budget period
      switch(budget.period) {
        case 'Weekly':
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - currentDate.getDay());
          break;
        case 'Monthly':
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          break;
        case 'Quarterly':
          const quarter = Math.floor(currentDate.getMonth() / 3);
          startDate = new Date(currentDate.getFullYear(), quarter * 3, 1);
          break;
        case 'Yearly':
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Default to monthly
      }
      
      // Find expenses in this category within the date range
      const expenses = await Expense.find({
        userId,
        category: budget.category,
        date: { $gte: startDate, $lte: endDate }
      });
      
      // Calculate total spent
      const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Update the budget with the calculated amount
      const updatedBudget = await Budget.findByIdAndUpdate(
        budget._id,
        { spent },
        { new: true }
      );
      
      results.push(updatedBudget);
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific budget
router.get('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a budget
router.put('/:id', async (req, res) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    
    await budget.deleteOne();
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
