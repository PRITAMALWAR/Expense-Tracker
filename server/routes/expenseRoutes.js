const express = require('express');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getAnalytics,
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(createExpense).get(getExpenses);
router.get('/analytics', getAnalytics);
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;


