// ============================================
// models/customer.js
// Database queries for Customer Management
// ============================================

const db = require('../db');

const Customer = {

    // Get every customer with their total booking count
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT 
                u.id, u.name, u.email, u.phone, u.is_blocked, u.created_at,
                COUNT(b.id) AS total_bookings
             FROM users u
             LEFT JOIN bookings b ON b.user_id = u.id
             WHERE u.role = 'customer'
             GROUP BY u.id
             ORDER BY u.created_at DESC`
        );
        return rows;
    },

    // Get one customer's profile + their full booking history
    getProfile: async (id) => {
        const [userRows] = await db.query(
            'SELECT id, name, email, phone, is_blocked, created_at FROM users WHERE id = ?',
            [id]
        );
        if (!userRows[0]) return null;

        const [bookings] = await db.query(
            `SELECT b.id, b.check_in, b.check_out, b.status, b.created_at,
                    r.room_number, r.room_type, r.price
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [id]
        );

        return { ...userRows[0], bookings };
    },

    // Toggle block/unblock
    setBlocked: async (id, isBlocked) => {
        const [result] = await db.query(
            'UPDATE users SET is_blocked = ? WHERE id = ?',
            [isBlocked, id]
        );
        return result.affectedRows;
    }

};

module.exports = Customer;
