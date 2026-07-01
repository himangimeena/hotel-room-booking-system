// ============================================
// controllers/settingsController.js
// ============================================

const bcrypt   = require('bcryptjs');
const Settings = require('../models/settings');
const db       = require('../db');

// GET /settings — admin only
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.get();
        res.status(200).json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Could not fetch settings' });
    }
};

// PUT /settings — admin only, update hotel info
const updateSettings = async (req, res) => {
    try {
        const { hotel_name, contact_phone, contact_email } = req.body;

        if (!hotel_name || !contact_email) {
            return res.status(400).json({ message: 'Hotel name and contact email are required' });
        }

        await Settings.update({ hotel_name, contact_phone, contact_email });
        res.status(200).json({ message: 'Hotel settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Could not update settings' });
    }
};

// PUT /settings/password — admin only, change own password
const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const adminId = req.user.id;

        if (!current_password || !new_password) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }
        if (new_password.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Fetch the admin's current hashed password
        const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [adminId]);
        if (!rows[0]) {
            return res.status(404).json({ message: 'Admin account not found' });
        }

        const match = await bcrypt.compare(current_password, rows[0].password);
        if (!match) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const newHash = await bcrypt.hash(new_password, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [newHash, adminId]);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Could not change password' });
    }
};

module.exports = { getSettings, updateSettings, changePassword };
