const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

// Get dashboard summary data
router.get('/summary', async (req, res) => {
  try {
    const userId = req.query.userId || 'demo-user';
    
    // Get current date ranges
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Get all data for the user
    const [expenses, budgets, savingsGoals] = await Promise.all([
      Expense.find({ userId }).sort({ date: -1 }),
      Budget.find({ userId }),
      SavingsGoal.find({ userId })
    ]);
    
    // Calculate current month expenses
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
    });
    
    const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate budget totals
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
    
    // Calculate savings totals
    const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    
    // Expense breakdown by category (current month)
    const expenseByCategory = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });
      
      const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      monthlyTrends.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear(),
        expenses: totalExpenses
      });
    }
    
    // Recent transactions (last 10)
    const recentTransactions = expenses.slice(0, 10).map(expense => ({
      id: expense._id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category
    }));
    
    const summary = {
      totals: {
        monthlyExpenses: monthlyTotal,
        totalBudget,
        totalSpent,
        budgetUsagePercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        totalSavingsTarget,
        totalSavingsCurrent,
        savingsProgressPercentage: totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0
      },
      counts: {
        expenseCount: currentMonthExpenses.length,
        budgetCount: budgets.length,
        savingsGoalCount: savingsGoals.length,
        totalTransactions: expenses.length
      },
      breakdown: {
        expenseByCategory,
        monthlyTrends
      },
      recentTransactions
    };
    
    res.json(summary);
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get expense trends for charts
router.get('/trends', async (req, res) => {
  try {
    const userId = req.query.userId || 'demo-user';
    const period = req.query.period || '6months'; // 6months, 1year
    
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    
    const currentDate = new Date();
    let months = 6;
    
    if (period === '1year') {
      months = 12;
    }
    
    const trends = [];
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });
      
      const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const categorizedExpenses = monthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});
      
      trends.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear(),
        total: totalExpenses,
        categories: categorizedExpenses,
        transactionCount: monthExpenses.length
      });
    }
    
    res.json(trends);
  } catch (err) {
    console.error('Dashboard trends error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
