
const mongoose = require('mongoose');

const SavingsGoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SavingsGoal', SavingsGoalSchema);
