// ============================================
// models/room.js
// All database queries related to ROOMS live here.
// ============================================

const db = require('../db');

const Room = {

    // Get all available rooms (for the rooms listing page)
    getAll: async () => {
        const [rows] = await db.query(
            'SELECT * FROM rooms WHERE is_available = TRUE ORDER BY room_number'
        );
        return rows;
    },

    // Get every room including unavailable (for admin dashboard)
    getAllAdmin: async () => {
        const [rows] = await db.query(
            'SELECT * FROM rooms ORDER BY room_number'
        );
        return rows;
    },

    // Get a single room by its ID
    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM rooms WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Add a new room (admin only)
    create: async ({ room_number, room_type, price, description }) => {
        const [result] = await db.query(
            'INSERT INTO rooms (room_number, room_type, price, description) VALUES (?, ?, ?, ?)',
            [room_number, room_type, price, description]
        );
        return result.insertId;
    },

    // Update room details (admin only)
    update: async (id, { room_number, room_type, price, description }) => {
        const [result] = await db.query(
            'UPDATE rooms SET room_number = ?, room_type = ?, price = ?, description = ? WHERE id = ?',
            [room_number, room_type, price, description, id]
        );
        return result.affectedRows; // 1 if updated, 0 if room not found
    },

    // Delete a room (admin only)
    delete: async (id) => {
        const [result] = await db.query(
            'DELETE FROM rooms WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    },

    // Count total rooms (for admin dashboard stats)
    count: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM rooms');
        return rows[0].total;
    }

};

module.exports = Room;
