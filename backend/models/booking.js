//============================================
// models/booking.js
// All database queries related to BOOKINGS live here.
// ============================================

const db = require('../db');

const Booking = {

    // Create a new booking
    create: async ({ user_id, room_id, check_in, check_out }) => {
        const [result] = await db.query(
            'INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)',
            [user_id, room_id, check_in, check_out]
        );
        return result.insertId;
    },

    // Get all bookings for ONE specific user (My Bookings page)
    // JOIN gets us room details alongside each booking
    findByUserId: async (user_id) => {
        const [rows] = await db.query(
            `SELECT 
                b.id,
                b.check_in,
                b.check_out,
                b.status,
                b.created_at,
                r.room_number,
                r.room_type,
                r.price
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [user_id]
        );
        return rows;
    },

    // Get ALL bookings (admin only, shows guest names too)
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT 
                b.id,
                b.check_in,
                b.check_out,
                b.status,
                b.created_at,
                u.name  AS guest_name,
                u.email AS guest_email,
                r.room_number,
                r.room_type,
                r.price
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN rooms r ON b.room_id = r.id
             ORDER BY b.created_at DESC`
        );
        return rows;
    },

    // Find a single booking by ID (used before cancelling)
    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Cancel a booking — only update status, don't delete
    cancel: async (id) => {
        const [result] = await db.query(
            "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    },

    // Count total bookings (for admin dashboard stats)
    count: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM bookings');
        return rows[0].total;
    }

};

module.exports = Booking;
