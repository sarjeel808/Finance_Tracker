
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    enum: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'],
    default: 'Monthly'
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
