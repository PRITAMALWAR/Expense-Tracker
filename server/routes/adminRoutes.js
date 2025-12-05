const express = require('express');
const { getOverview, getUsersWithStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/overview', getOverview);
router.get('/users', getUsersWithStats);

module.exports = router;


