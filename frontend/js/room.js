requireLogin(); // Make sure user is logged in

let selectedRoomId = null;

// Load and display all rooms when page opens
async function loadRooms() {
    try {
        const res = await fetch('http://localhost:5000/rooms');
        const rooms = await res.json();
        
        const list = document.getElementById('rooms-list');
        
        if (rooms.length === 0) {
            list.innerHTML = '<p style="color: var(--gray); text-align:center;">No rooms available</p>';
            return;
        }

        list.innerHTML = rooms.map(room => `
            <div class="room-card">
                <div class="room-info">
                    <h3>Room ${room.room_number}</h3>
                    <p>${room.room_type}</p>
                    ${room.description ? `<p style="color:#666; font-size:0.8rem;">${room.description}</p>` : ''}
                </div>
                <div style="display:flex; align-items:center; gap:16px;">
                    <span class="room-price">₹${Number(room.price).toLocaleString()}</span>
                    <button class="btn-gold" onclick="openModal(${room.id}, '${room.room_number}')">
                        Book Now
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('rooms-list').innerHTML = 
            '<p style="color:red;">Could not load rooms. Make sure the server is running.</p>';
    }
}

function openModal(roomId, roomName) {
    selectedRoomId = roomId;
    document.getElementById('modal-room-name').textContent = roomName;
    document.getElementById('booking-modal').style.display = 'flex';
    // Set minimum date to today
    document.getElementById('check-in').min = new Date().toISOString().split('T')[0];
    document.getElementById('check-out').min = new Date().toISOString().split('T')[0];
}

function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
    selectedRoomId = null;
}

async function confirmBooking() {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    if (!checkIn || !checkOut) {
        document.getElementById('booking-alert').innerHTML = 
            '<div class="alert alert-error">Please select check-in and check-out dates</div>';
        return;
    }

    if (checkOut <= checkIn) {
        document.getElementById('booking-alert').innerHTML = 
            '<div class="alert alert-error">Check-out must be after check-in</div>';
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ room_id: selectedRoomId, check_in: checkIn, check_out: checkOut })
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('booking-alert').innerHTML = 
                '<div class="alert alert-success">Room booked successfully! 🎉</div>';
            setTimeout(() => {
                closeModal();
                window.location.href = 'my-bookings.html';
            }, 1500);
        } else {
            document.getElementById('booking-alert').innerHTML = 
                `<div class="alert alert-error">${data.message}</div>`;
        }
    } catch (err) {
        document.getElementById('booking-alert').innerHTML = 
            '<div class="alert alert-error">Booking failed. Try again.</div>';
    }
}

// Load rooms when page opens
loadRooms();