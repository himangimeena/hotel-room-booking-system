// ============================================
// controllers/revenueController.js
// ============================================

const Revenue = require('../models/revenue');

// GET /revenue — admin only
const getRevenueSummary = async (req, res) => {
    try {
        const [today, monthly, total, bookingCount, last7Days] = await Promise.all([
            Revenue.getToday(),
            Revenue.getMonthly(),
            Revenue.getTotal(),
            Revenue.getValidBookingCount(),
            Revenue.getLast7Days()
        ]);

        const average = bookingCount > 0 ? Math.round(total / bookingCount) : 0;

        res.status(200).json({
            today,
            monthly,
            total,
            average,
            last7Days
        });
    } catch (error) {
        console.error('Revenue error:', error);
        res.status(500).json({ message: 'Could not calculate revenue' });
    }
};

// GET /reports — admin only
const getReports = async (req, res) => {
    try {
        const [mostBooked, leastBooked, highestRevenueRoom, occupancyRate] = await Promise.all([
            Revenue.getMostBooked(),
            Revenue.getLeastBooked(),
            Revenue.getHighestRevenueRoom(),
            Revenue.getOccupancyRate()
        ]);

        res.status(200).json({
            mostBooked,
            leastBooked,
            highestRevenueRoom,
            occupancyRate
        });
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ message: 'Could not generate reports' });
    }
};

module.exports = { getRevenueSummary, getReports };
