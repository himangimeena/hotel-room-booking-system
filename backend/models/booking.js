// ============================================
// models/booking.js  (UPDATED)
// Now supports: pending / approved / completed / cancelled
// ============================================

const db = require('../db');

const Booking = {

    create: async ({ user_id, room_id, check_in, check_out }) => {
        const [result] = await db.query(
            "INSERT INTO bookings (user_id, room_id, check_in, check_out, status) VALUES (?, ?, ?, ?, 'pending')",
            [user_id, room_id, check_in, check_out]
        );
        return result.insertId;
    },

    findByUserId: async (user_id) => {
        const [rows] = await db.query(
            `SELECT b.id, b.check_in, b.check_out, b.status, b.created_at,
                    r.room_number, r.room_type, r.price
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [user_id]
        );
        return rows;
    },

    // All bookings, newest first — includes room_id for admin actions
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT b.id, b.room_id, b.check_in, b.check_out, b.status, b.created_at,
                    u.name AS guest_name, u.email AS guest_email,
                    r.room_number, r.room_type, r.price
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN rooms r ON b.room_id = r.id
             ORDER BY b.created_at DESC`
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
        return rows[0];
    },

    // Generic status updater used by approve / complete / cancel
    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows;
    },

    count: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM bookings');
        return rows[0].total;
    },

    // Today's check-ins / check-outs — for Dashboard cards
    countTodayCheckIns: async () => {
        const [rows] = await db.query(
            "SELECT COUNT(*) as total FROM bookings WHERE check_in = CURDATE() AND status != 'cancelled'"
        );
        return rows[0].total;
    },

    countTodayCheckOuts: async () => {
        const [rows] = await db.query(
            "SELECT COUNT(*) as total FROM bookings WHERE check_out = CURDATE() AND status != 'cancelled'"
        );
        return rows[0].total;
    }

};

module.exports = Booking;
