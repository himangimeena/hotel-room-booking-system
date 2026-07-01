// ============================================
// routes/bookings.js  (UPDATED)
// Added: approve, complete routes
// ============================================

const express = require('express');
const router  = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
    createBooking,
    getMyBookings,
    getAllBookings,
    approveBooking,
    completeBooking,
    cancelBooking,
    getDashboardStats
} = require('../controllers/bookingController');

// Specific paths BEFORE /:id routes
router.get('/stats',           verifyAdmin,  getDashboardStats);
router.get('/my-bookings',     verifyToken,  getMyBookings);
router.get('/all',             verifyAdmin,  getAllBookings);

router.post('/',               verifyToken,  createBooking);

router.patch('/:id/approve',   verifyAdmin,  approveBooking);
router.patch('/:id/complete',  verifyAdmin,  completeBooking);
router.patch('/:id/cancel',    verifyToken,  cancelBooking); // customer or admin

module.exports = router;
