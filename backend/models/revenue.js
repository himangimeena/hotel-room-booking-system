// models/revenue.js
const db = require('../db');

const Revenue = {

    // Today's revenue — bookings created today, price × nights
    getToday: async () => {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(r.price * DATEDIFF(b.check_out, b.check_in)), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE DATE(b.created_at) = CURDATE()
               AND b.status NOT IN ('cancelled')`
        );
        return Number(rows[0].total);
    },

    getMonthly: async () => {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(r.price * DATEDIFF(b.check_out, b.check_in)), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE MONTH(b.created_at) = MONTH(CURDATE())
               AND YEAR(b.created_at)  = YEAR(CURDATE())
               AND b.status NOT IN ('cancelled')`
        );
        return Number(rows[0].total);
    },

    getTotal: async () => {
        const [rows] = await db.query(
            `SELECT COALESCE(SUM(r.price * DATEDIFF(b.check_out, b.check_in)), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.status NOT IN ('cancelled')`
        );
        return Number(rows[0].total);
    },

    getValidBookingCount: async () => {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS cnt FROM bookings WHERE status NOT IN ('cancelled')`
        );
        return Number(rows[0].cnt);
    },

    getLast7Days: async () => {
        const [rows] = await db.query(
            `SELECT DATE(b.created_at) AS day,
                    COALESCE(SUM(r.price * DATEDIFF(b.check_out, b.check_in)), 0) AS total
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
               AND b.status NOT IN ('cancelled')
             GROUP BY DATE(b.created_at)
             ORDER BY day ASC`
        );
        return rows;
    },

    // ── REPORTS ─────────────────────────────────────────────
    getMostBooked: async () => {
        const [rows] = await db.query(
            `SELECT r.id, r.room_number, r.room_type, COUNT(b.id) AS booking_count
             FROM bookings b JOIN rooms r ON b.room_id = r.id
             WHERE b.status NOT IN ('cancelled')
             GROUP BY r.id ORDER BY booking_count DESC LIMIT 1`
        );
        return rows[0] || null;
    },

    getLeastBooked: async () => {
        const [rows] = await db.query(
            `SELECT r.id, r.room_number, r.room_type, COUNT(b.id) AS booking_count
             FROM bookings b JOIN rooms r ON b.room_id = r.id
             WHERE b.status NOT IN ('cancelled')
             GROUP BY r.id ORDER BY booking_count ASC LIMIT 1`
        );
        return rows[0] || null;
    },

    getHighestRevenueRoom: async () => {
        const [rows] = await db.query(
            `SELECT r.id, r.room_number, r.room_type,
                    SUM(r.price * DATEDIFF(b.check_out, b.check_in)) AS revenue
             FROM bookings b JOIN rooms r ON b.room_id = r.id
             WHERE b.status NOT IN ('cancelled')
             GROUP BY r.id ORDER BY revenue DESC LIMIT 1`
        );
        return rows[0] || null;
    },

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