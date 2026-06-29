// ============================================
// controllers/bookingController.js
// Business logic for all booking operations
// ============================================

const Booking = require('../models/booking');
const Room    = require('../models/room');

// ── CREATE BOOKING ───────────────────────────
// POST /bookings
// Logged-in customers only
const createBooking = async (req, res) => {
    try {
        const { room_id, check_in, check_out } = req.body;
        const user_id = req.user.id; // comes from the JWT token via verifyToken middleware

        // 1. Validate all fields present
        if (!room_id || !check_in || !check_out) {
            return res.status(400).json({ message: 'room_id, check_in and check_out are required' });
        }

        // 2. Check-out must be after check-in
        if (new Date(check_out) <= new Date(check_in)) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date' });
        }

        // 3. Check-in must not be in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(check_in) < today) {
            return res.status(400).json({ message: 'Check-in date cannot be in the past' });
        }

        // 4. Verify the room exists and is available
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (!room.is_available) {
            return res.status(400).json({ message: 'This room is not available for booking' });
        }

        // 5. Create the booking
        const bookingId = await Booking.create({ user_id, room_id, check_in, check_out });

        res.status(201).json({
            message: `Room ${room.room_number} booked successfully! 🎉`,
            bookingId
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Could not create booking' });
    }
};

// ── MY BOOKINGS ──────────────────────────────
// GET /bookings/my-bookings
// Logged-in customer sees their own bookings
const getMyBookings = async (req, res) => {
    try {
        const user_id = req.user.id;
        const bookings = await Booking.findByUserId(user_id);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: 'Could not fetch bookings' });
    }
};

// ── ALL BOOKINGS (ADMIN) ─────────────────────
// GET /bookings/all
// Admin only — sees every booking from every guest
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        const total    = await Booking.count();
        res.status(200).json({ total, bookings });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Could not fetch bookings' });
    }
};

// ── CANCEL BOOKING ───────────────────────────
// PATCH /bookings/:id/cancel
// Logged-in customer can cancel their OWN booking
const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId    = req.user.id;

        // 1. Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // 2. Make sure it belongs to this user (security check!)
        if (booking.user_id !== userId) {
            return res.status(403).json({ message: 'You can only cancel your own bookings' });
        }

        // 3. Can only cancel a "booked" booking, not already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'This booking is already cancelled' });
        }

        // 4. Cancel it
        await Booking.cancel(bookingId);

        res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Could not cancel booking' });
    }
};

// ── DASHBOARD STATS (ADMIN) ──────────────────
// GET /bookings/stats
// Returns counts for the admin dashboard
const getDashboardStats = async (req, res) => {
    try {
        const totalBookings = await Booking.count();
        const totalRooms    = await Room.count();
        res.status(200).json({ totalBookings, totalRooms });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Could not fetch stats' });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking, getDashboardStats };
