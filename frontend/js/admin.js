requireLogin();

// Make sure only admins can access this page
const userData = JSON.parse(localStorage.getItem('user') || '{}');
if (userData.role !== 'admin') {
    window.location.href = 'rooms.html';
}

async function loadDashboard() {
    try {
        // Load rooms count
        const roomsRes = await fetch('http://localhost:5000/rooms');
        const rooms = await roomsRes.json();
        document.getElementById('total-rooms').textContent = rooms.length;

        // Load all bookings
        const bookingsRes = await fetch('http://localhost:5000/bookings/all', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const bookings = await bookingsRes.json();
        document.getElementById('total-bookings').textContent = bookings.length;

        // Render bookings list
        const list = document.getElementById('all-bookings-list');
        if (bookings.length === 0) {
            list.innerHTML = '<p style="color:var(--gray);">No bookings yet</p>';
            return;
        }

        list.innerHTML = bookings.map(b => `
            <div style="display:flex; justify-content:space-between; padding:16px 0; 
                        border-bottom:1px solid rgba(255,255,255,0.05); align-items:center;">
                <div>
                    <p style="font-weight:bold;">${b.guest_name}</p>
                    <p style="color:var(--gray); font-size:0.85rem;">Room ${b.room_number} – ${b.room_type}</p>
                </div>
                <div style="text-align:right;">
                    <p style="color:var(--gold); font-size:0.85rem;">
                        ${new Date(b.check_in).toLocaleDateString()} – ${new Date(b.check_out).toLocaleDateString()}
                    </p>
                    <span class="badge badge-${b.status}">${b.status.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

function showAddRoom() {
    const form = document.getElementById('add-room-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function addRoom() {
    const room_number = document.getElementById('new-room-number').value;
    const room_type = document.getElementById('new-room-type').value;
    const price = document.getElementById('new-room-price').value;
    const description = document.getElementById('new-room-desc').value;

    if (!room_number || !room_type || !price) {
        document.getElementById('add-room-alert').innerHTML = 
            '<div class="alert alert-error">Please fill all required fields</div>';
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/rooms', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ room_number, room_type, price: Number(price), description })
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('add-room-alert').innerHTML = 
                '<div class="alert alert-success">Room added successfully!</div>';
            loadDashboard();
        } else {
            document.getElementById('add-room-alert').innerHTML = 
                `<div class="alert alert-error">${data.message}</div>`;
        }
    } catch (err) {
        document.getElementById('add-room-alert').innerHTML = 
            '<div class="alert alert-error">Failed to add room</div>';
    }
}

function showEditRoom() {
    const id = prompt('Enter Room ID to edit:');
    if (!id) return;
    const type = prompt('New room type:');
    const price = prompt('New price:');
    if (!type || !price) return;
    
    fetch(`http://localhost:5000/rooms/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ room_type: type, price: Number(price) })
    }).then(res => {
        if (res.ok) { alert('Room updated!'); loadDashboard(); }
        else alert('Update failed');
    });
}

function showDeleteRoom() {
    const id = prompt('Enter Room ID to delete:');
    if (!id) return;
    if (!confirm(`Delete room ${id}?`)) return;

    fetch(`http://localhost:5000/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    }).then(res => {
        if (res.ok) { alert('Room deleted!'); loadDashboard(); }
        else alert('Delete failed');
    });
}

loadDashboard();