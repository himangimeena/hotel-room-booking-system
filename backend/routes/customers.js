// ============================================
// routes/customers.js
// ============================================

const express = require('express');
const router  = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const {
    getAllCustomers,
    getCustomerProfile,
    toggleBlock
} = require('../controllers/customerController');

// All customer management routes are admin-only
router.get('/',              verifyAdmin, getAllCustomers);
router.get('/:id',           verifyAdmin, getCustomerProfile);
router.patch('/:id/block',   verifyAdmin, toggleBlock);

module.exports = router;
