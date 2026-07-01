// ============================================
// routes/rooms.js  (UPDATED)
// Added: PATCH /rooms/:id/status
// ============================================

const express = require('express');
const router  = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const {
    getAllRooms,
    getAllRoomsAdmin,
    addRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom
} = require('../controllers/roomController');

router.get('/',             getAllRooms);                       // anyone
router.get('/admin',        verifyAdmin, getAllRoomsAdmin);      // admin: see all incl. maintenance
router.post('/',            verifyAdmin, addRoom);               // admin
router.put('/:id',          verifyAdmin, updateRoom);            // admin
router.patch('/:id/status', verifyAdmin, updateRoomStatus);      // admin: quick status change
router.delete('/:id',       verifyAdmin, deleteRoom);            // admin

module.exports = router;
