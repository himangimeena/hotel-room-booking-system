// ============================================
// routes/revenue.js
// ============================================

const express = require('express');
const router  = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const { getRevenueSummary, getReports } = require('../controllers/revenueController');

router.get('/',         verifyAdmin, getRevenueSummary); // GET /revenue
router.get('/reports',  verifyAdmin, getReports);        // GET /revenue/reports

module.exports = router;
