// ============================================
// controllers/roomController.js
// Business logic for all room operations
// ============================================

const Room = require('../models/room');

// ── GET ALL ROOMS ────────────────────────────
// GET /rooms
// Anyone (logged in or not) can view rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.getAll();
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({ message: 'Could not fetch rooms' });
    }
};

// ── GET ALL ROOMS (ADMIN) ────────────────────
// GET /rooms/admin
// Admin sees all rooms including unavailable
const getAllRoomsAdmin = async (req, res) => {
    try {
        const rooms = await Room.getAllAdmin();
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Get admin rooms error:', error);
        res.status(500).json({ message: 'Could not fetch rooms' });
    }
};

// ── ADD ROOM ─────────────────────────────────
// POST /rooms
// Admin only
const addRoom = async (req, res) => {
    try {
        const { room_number, room_type, price, description } = req.body;

        // Validate required fields
        if (!room_number || !room_type || !price) {
            return res.status(400).json({
                message: 'room_number, room_type and price are required'
            });
        }

        // Price must be a positive number
        if (isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }

        const newRoomId = await Room.create({ room_number, room_type, price, description });

        res.status(201).json({
            message: `Room ${room_number} added successfully`,
            roomId: newRoomId
        });

    } catch (error) {
        console.error('Add room error:', error);
        res.status(500).json({ message: 'Could not add room' });
    }
};

// ── UPDATE ROOM ──────────────────────────────
// PUT /rooms/:id
// Admin only
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, room_type, price, description } = req.body;

        // Check the room exists first
        const existing = await Room.findById(id);
        if (!existing) {
            return res.status(404).json({ message: `Room with ID ${id} not found` });
        }

        // Use existing values as defaults if not provided in request
        const updated = {
            room_number:  room_number  || existing.room_number,
            room_type:    room_type    || existing.room_type,
            price:        price        || existing.price,
            description:  description  !== undefined ? description : existing.description
        };

        await Room.update(id, updated);

        res.status(200).json({ message: `Room ${id} updated successfully` });

    } catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({ message: 'Could not update room' });
    }
};

// ── DELETE ROOM ──────────────────────────────
// DELETE /rooms/:id
// Admin only
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // Check it exists first
        const existing = await Room.findById(id);
        if (!existing) {
            return res.status(404).json({ message: `Room with ID ${id} not found` });
        }

        await Room.delete(id);

        res.status(200).json({ message: `Room ${id} deleted successfully` });

    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({ message: 'Could not delete room' });
    }
};

module.exports = { getAllRooms, getAllRoomsAdmin, addRoom, updateRoom, deleteRoom };
