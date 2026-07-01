// ============================================
// models/settings.js
// ============================================

const db = require('../db');

const Settings = {

    get: async () => {
        const [rows] = await db.query('SELECT * FROM hotel_settings WHERE id = 1');
        return rows[0];
    },

    update: async ({ hotel_name, contact_phone, contact_email }) => {
        const [result] = await db.query(
            'UPDATE hotel_settings SET hotel_name = ?, contact_phone = ?, contact_email = ? WHERE id = 1',
            [hotel_name, contact_phone, contact_email]
        );
        return result.affectedRows;
    }

};

module.exports = Settings;
