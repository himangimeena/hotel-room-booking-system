// ============================================
// models/revenue.js
// Revenue + Reports calculations
// ============================================

const db = require('../db');

const Revenue = {

    // Today's revenue — completed/approved bookings created today
    getToday: async () => {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(r.price), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE DATE(b.created_at) = CURDATE()
               AND b.status != 'cancelled'`
        );
        return Number(rows[0].total);
    },

    // This calendar month's revenue
    getMonthly: async () => {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(r.price), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE MONTH(b.created_at) = MONTH(CURDATE())
               AND YEAR(b.created_at) = YEAR(CURDATE())
               AND b.status != 'cancelled'`
        );
        return Number(rows[0].total);
    },

    // All-time revenue (excluding cancelled)
    getTotal: async () => {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(r.price), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.status != 'cancelled'`
        );
        return Number(rows[0].total);
    },

    // Count of non-cancelled bookings (used for average)
    getValidBookingCount: async () => {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS cnt FROM bookings WHERE status != 'cancelled'`
        );
        return Number(rows[0].cnt);
    },

    // Last 7 days revenue, for a simple chart
    getLast7Days: async () => {
        const [rows] = await db.query(
            `SELECT DATE(b.created_at) AS day, COALESCE(SUM(r.price), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
               AND b.status != 'cancelled'
             GROUP BY DATE(b.created_at)
             ORDER BY day ASC`
        );
        return rows;
    },

    // ── REPORTS ──────────────────────────────

    // Most booked room (by number of bookings)
    getMostBooked: async () => {
        const [rows] = await db.query(
            `SELECT r.id, r.room_number, r.room_type, COUNT(b.id) AS booking_count
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             GROUP BY r.id
             ORDER BY booking_count DESC
             LIMIT 1`
        );
        return rows[0] || null;
    },

    // Least booked room (must have at least 1 booking)
    getLeastBooked: async () => {
        const [rows] = await db.query(
            `SELECT r.id, r.room_number, r.room_type, COUNT(b.id) AS booking_count
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             GROUP BY r.id
             ORDER BY booking_count ASC
             LIMIT 1`
        );
        return rows[0] || null;
    },

    // Highest revenue-generating room
    getHighestRevenueRoom: async () => {
        const [rows] = await db.query(
            `SELECT r.id, r.room_number, r.room_type, SUM(r.price) AS revenue
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.status != 'cancelled'
             GROUP BY r.id
             ORDER BY revenue DESC
             LIMIT 1`
        );
        return rows[0] || null;
    },

    // Occupancy rate = occupied rooms / total rooms * 100
    getOccupancyRate: async () => {
        const [rows] = await db.query(
            `SELECT 
                (SELECT COUNT(*) FROM rooms WHERE status = 'occupied') AS occupied,
                (SELECT COUNT(*) FROM rooms) AS total`
        );
        const { occupied, total } = rows[0];
        return total > 0 ? Math.round((occupied / total) * 100) : 0;
    }

};

module.exports = Revenue;
