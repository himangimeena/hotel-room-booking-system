// ============================================
// models/user.js
// All database queries related to USERS live here.
// Controllers call these functions — they never
// write SQL themselves. This keeps code clean.
// ============================================

const db = require('../db');

const User = {

    // Find a user by their email address
    // Used during login to look up the user
    findByEmail: async (email) => {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0]; // returns undefined if not found
    },

    // Find a user by their ID
    // Used when we need to fetch profile info
    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Create a new user in the database
    // password should already be hashed before calling this
    create: async ({ name, email, password, role = 'customer' }) => {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId; // returns the new user's ID
    },

    // Check if an email already exists (for registration validation)
    emailExists: async (email) => {
        const [rows] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        return rows.length > 0; // true if exists, false if not
    }

};

module.exports = User;
