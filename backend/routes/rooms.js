const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// GET /rooms – Get all available rooms (anyone can see)
router.get('/', async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM rooms WHERE is_available = TRUE');
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /rooms – Add a new room (admin only)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const { room_number, room_type, price, description } = req.body;
        await db.query(
            'INSERT INTO rooms (room_number, room_type, price, description) VALUES (?, ?, ?, ?)',
            [room_number, room_type, price, description]
        );
        res.status(201).json({ message: 'Room added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /rooms/:id – Update a room (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const { room_number, room_type, price, description } = req.body;
        await db.query(
            'UPDATE rooms SET room_number=?, room_type=?, price=?, description=? WHERE id=?',
            [room_number, room_type, price, description, req.params.id]
        );
        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /rooms/:id – Delete a room (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;