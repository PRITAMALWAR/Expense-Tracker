const User = require('../models/User');
const Expense = require('../models/Expense');

// @desc    Get high-level admin overview stats
// @route   GET /api/admin/overview
// @access  Admin
exports.getOverview = async (req, res) => {
  try {
    const [userCount, expenseCount, totalAmountAgg, todayAgg] = await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      Expense.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
      (() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return Expense.aggregate([
          {
            $match: {
              date: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);
      })(),
    ]);

    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;
    const todayTotal = todayAgg[0]?.totalAmount || 0;

    res.json({
      userCount,
      expenseCount,
      totalAmount,
      todayTotal,
    });
  } catch (error) {
    console.error('Admin overview error:', error.message);
    res.status(500).json({ message: 'Server error while fetching admin overview' });
  }
};

// @desc    Get all users with their total spending (includes users with 0 expenses)
// @route   GET /api/admin/users
// @access  Admin
exports.getUsersWithStats = async (req, res) => {
  try {
    const [allUsers, agg] = await Promise.all([
      User.find().select('name email role createdAt'),
      Expense.aggregate([
        {
          $group: {
            _id: '$userId',
            totalAmount: { $sum: '$amount' },
            expenseCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statsByUserId = new Map(
      agg.map((a) => [
        a._id.toString(),
        { totalAmount: a.totalAmount, expenseCount: a.expenseCount },
      ])
    );

    const users = allUsers
      .map((u) => {
        const key = u._id.toString();
        const stat = statsByUserId.get(key) || { totalAmount: 0, expenseCount: 0 };
        return {
          userId: u._id,
          name: u.name,
          email: u.email,
          role: u.role || 'user',
          totalAmount: stat.totalAmount,
          expenseCount: stat.expenseCount,
          createdAt: u.createdAt,
        };
      })
      // Sort by totalAmount descending for nicer admin view
      .sort((a, b) => b.totalAmount - a.totalAmount);

    res.json({ users });
  } catch (error) {
    console.error('Admin users stats error:', error.message);
    res.status(500).json({ message: 'Server error while fetching user stats' });
  }
};


