
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses for a specific user
router.get('/', async (req, res) => {
  try {
    // In a real app, you would get the userId from JWT auth middleware
    // For now, we'll use a query parameter or default value for demo
    const userId = req.query.userId || 'demo-user';
    
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const expense = new Expense({
    category: req.body.category,
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    userId: req.body.userId || 'demo-user'
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    if (req.body.category) expense.category = req.body.category;
    if (req.body.amount) expense.amount = req.body.amount;
    if (req.body.date) expense.date = req.body.date;
    if (req.body.description) expense.description = req.body.description;
    
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
