// ============================================
// controllers/bookingController.js  (UPDATED)
// Added: approveBooking, completeBooking,
// expanded getDashboardStats with all 7 metrics
// ============================================

const Booking = require('../models/booking');
const Room    = require('../models/room');
const Revenue = require('../models/revenue');

// ── CREATE BOOKING ───────────────────────────
// POST /bookings
const createBooking = async (req, res) => {
    try {
        const { room_id, check_in, check_out } = req.body;
        const user_id = req.user.id;

        if (!room_id || !check_in || !check_out) {
            return res.status(400).json({ message: 'room_id, check_in and check_out are required' });
        }
        if (new Date(check_out) <= new Date(check_in)) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(check_in) < today) {
            return res.status(400).json({ message: 'Check-in date cannot be in the past' });
        }

        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (room.status !== 'available') {
            return res.status(400).json({ message: `Room ${room.room_number} is currently ${room.status} and cannot be booked` });
        }

        const bookingId = await Booking.create({ user_id, room_id, check_in, check_out });

        res.status(201).json({
            message: `Room ${room.room_number} booking request submitted! Awaiting confirmation.`,
            bookingId
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Could not create booking' });
    }
};

// ── MY BOOKINGS ──────────────────────────────
// GET /bookings/my-bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findByUserId(req.user.id);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: 'Could not fetch bookings' });
    }
};

// ── ALL BOOKINGS (ADMIN) ─────────────────────
// GET /bookings/all
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json({ total: bookings.length, bookings });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Could not fetch bookings' });
    }
};

// ── APPROVE BOOKING (ADMIN) ──────────────────
// PATCH /bookings/:id/approve
const approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: `Cannot approve a booking that is already ${booking.status}` });
        }

        await Booking.updateStatus(booking.id, 'approved');
        // Mark the room as occupied once approved
        await Room.updateStatus(booking.room_id, 'occupied');

        res.status(200).json({ message: 'Booking approved successfully' });
    } catch (error) {
        console.error('Approve booking error:', error);
        res.status(500).json({ message: 'Could not approve booking' });
    }
};

// ── COMPLETE BOOKING (ADMIN) ─────────────────
// PATCH /bookings/:id/complete
const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'approved') {
            return res.status(400).json({ message: 'Only approved bookings can be marked complete' });
        }

        await Booking.updateStatus(booking.id, 'completed');
        // Free up the room again after guest checks out
        await Room.updateStatus(booking.room_id, 'available');

        res.status(200).json({ message: 'Booking marked as completed' });
    } catch (error) {
        console.error('Complete booking error:', error);
        res.status(500).json({ message: 'Could not complete booking' });
    }
};

// ── CANCEL BOOKING ───────────────────────────
// PATCH /bookings/:id/cancel
// Customer can cancel their own; Admin can cancel any
const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Customers may only cancel their own bookings; admins may cancel any
        if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
            return res.status(403).json({ message: 'You can only cancel your own bookings' });
        }
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({ message: `This booking is already ${booking.status}` });
        }

        await Booking.updateStatus(bookingId, 'cancelled');

        // If the room had been marked occupied for this booking, free it
        const room = await Room.findById(booking.room_id);
        if (room && room.status === 'occupied') {
            await Room.updateStatus(booking.room_id, 'available');
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Could not cancel booking' });
    }
};

// ── DASHBOARD STATS (ADMIN) ──────────────────
// GET /bookings/stats — all 7 metrics for the dashboard cards
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalRooms, totalBookings, availableRooms, occupiedRooms,
            todayCheckIns, todayCheckOuts, monthlyRevenue
        ] = await Promise.all([
            Room.count(),
            Booking.count(),
            Room.countByStatus('available'),
            Room.countByStatus('occupied'),
            Booking.countTodayCheckIns(),
            Booking.countTodayCheckOuts(),
            Revenue.getMonthly()
        ]);

        res.status(200).json({
            totalRooms, totalBookings, availableRooms, occupiedRooms,
            todayCheckIns, todayCheckOuts, monthlyRevenue
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Could not fetch stats' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    approveBooking,
    completeBooking,
    cancelBooking,
    getDashboardStats
};
