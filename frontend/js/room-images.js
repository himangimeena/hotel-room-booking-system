/* ================================================
   js/room-images.js
   Maps room_type text (from the database) to a
   thumbnail image. Used on Room Management,
   Bookings, and the customer Rooms page.
   ================================================ */

const ROOM_IMAGES = {
  'Single Room':        'images/rooms/single-room.jpg',
  'Double Room':         'images/rooms/double-room.jpg',
  'Deluxe Suite':        'images/rooms/deluxe-suite.jpg',
  'Ocean View':          'images/rooms/ocean-view.jpg',
  'Presidential Suite':  'images/rooms/presidential-suite.jpg'
};

function getRoomImage(roomType) {
  return ROOM_IMAGES[roomType] || 'images/rooms/single-room.jpg';
}
