const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// POST /bookings – Book a room (logged-in customers)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { room_id, check_in, check_out } = req.body;
        const user_id = req.user.id;

        // Check if room exists and is available
        const [rooms] = await db.query(
            'SELECT * FROM rooms WHERE id = ? AND is_available = TRUE', [room_id]
        );
        if (rooms.length === 0) {
            return res.status(400).json({ message: 'Room not available' });
        }

        // Create the booking
        await db.query(
            'INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)',
            [user_id, room_id, check_in, check_out]
        );

        res.status(201).json({ message: 'Room booked successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /my-bookings – See my bookings (logged-in customer)
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.id, b.check_in, b.check_out, b.status, b.created_at,
                    r.room_number, r.room_type, r.price
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.user.id]
        );
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /bookings/:id/cancel – Cancel a booking
router.patch('/:id/cancel', verifyToken, async (req, res) => {
    try {
        // Make sure the booking belongs to this user
        const [bookings] = await db.query(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await db.query(
            'UPDATE bookings SET status = "cancelled" WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /bookings/all – Admin sees all bookings
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.id, b.check_in, b.check_out, b.status, b.created_at,
                    u.name as guest_name, u.email,
                    r.room_number, r.room_type, r.price
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN rooms r ON b.room_id = r.id
             ORDER BY b.created_at DESC`
        );
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;