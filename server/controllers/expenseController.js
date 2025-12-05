const Expense = require('../models/Expense');

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    if (!title || !amount || !date) {
      return res.status(400).json({ message: 'Title, amount, and date are required' });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      note,
      userId: req.user._id,
    });

    res.status(201).json({ expense });
  } catch (error) {
    console.error('Create expense error:', error.message);
    res.status(500).json({ message: 'Server error while creating expense' });
  }
};

// @desc    Get expenses with optional filters
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const filter = { userId: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error.message);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, note } = req.body;

    const expense = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (note !== undefined) expense.note = note;

    const updated = await expense.save();

    res.json({ expense: updated });
  } catch (error) {
    console.error('Update expense error:', error.message);
    res.status(500).json({ message: 'Server error while updating expense' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error.message);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
};

// @desc    Get expense analytics (monthly total, category-wise, trend, highest category)
// @route   GET /api/expenses/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetYear = parseInt(year, 10) || now.getFullYear();
    const targetMonth = parseInt(month, 10) || now.getMonth() + 1; // 1-12

    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const matchStage = {
      userId: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };

    const agg = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalMonthly = agg.reduce((sum, item) => sum + item.totalAmount, 0);

    const categoryBreakdown = agg.map((item) => ({
      category: item._id,
      totalAmount: item.totalAmount,
    }));

    const highestCategory = categoryBreakdown.reduce(
      (max, item) => (item.totalAmount > (max?.totalAmount || 0) ? item : max),
      null
    );

    // Trend for last 6 months
    const sixMonthsAgo = new Date(targetYear, targetMonth - 6, 1);
    const trendAgg = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: sixMonthsAgo, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyTrend = trendAgg.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalAmount: item.totalAmount,
    }));

    res.json({
      totalMonthly,
      categoryBreakdown,
      highestCategory,
      monthlyTrend,
    });
  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({ message: 'Server error while getting analytics' });
  }
};


