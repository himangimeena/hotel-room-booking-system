// ============================================
// models/room.js  (UPDATED)
// Now includes: status field everywhere,
// updateStatus() function
// ============================================

const db = require('../db');

const Room = {

    // Get all available rooms (status != maintenance, for customer browsing)
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM rooms WHERE status != 'maintenance' ORDER BY room_number"
        );
        return rows;
    },

    // Admin sees every room regardless of status
    getAllAdmin: async () => {
        const [rows] = await db.query('SELECT * FROM rooms ORDER BY room_number');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
        return rows[0];
    },

    create: async ({ room_number, room_type, price, description }) => {
        const [result] = await db.query(
            "INSERT INTO rooms (room_number, room_type, price, description, status) VALUES (?, ?, ?, ?, 'available')",
            [room_number, room_type, price, description]
        );
        return result.insertId;
    },

    update: async (id, { room_number, room_type, price, description }) => {
        const [result] = await db.query(
            'UPDATE rooms SET room_number = ?, room_type = ?, price = ?, description = ? WHERE id = ?',
            [room_number, room_type, price, description, id]
        );
        return result.affectedRows;
    },

    // Change ONLY the status field — used by the inline dropdown in admin UI
    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE rooms SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM rooms WHERE id = ?', [id]);
        return result.affectedRows;
    },

    count: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM rooms');
        return rows[0].total;
    },

    // Count by status — used on the Dashboard (Available / Occupied cards)
    countByStatus: async (status) => {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM rooms WHERE status = ?',
            [status]
        );
        return rows[0].total;
    }

};

module.exports = Room;
