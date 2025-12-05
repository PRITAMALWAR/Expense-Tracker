const mongoose = require('mongoose');

const CATEGORY_ENUM = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: CATEGORY_ENUM,
      default: 'Other',
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
module.exports.CATEGORY_ENUM = CATEGORY_ENUM;


