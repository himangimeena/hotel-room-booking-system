requireLogin();

async function loadMyBookings() {
    try {
        const res = await fetch('http://localhost:5000/bookings/my-bookings', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const bookings = await res.json();
        const list = document.getElementById('bookings-list');

        if (bookings.length === 0) {
            list.innerHTML = `<p style="color:var(--gray);">No bookings yet. 
                <a href="rooms.html" style="color:var(--gold);">Explore Rooms</a></p>`;
            return;
        }

        list.innerHTML = bookings.map(b => `
            <div class="room-card">
                <div class="room-info">
                    <h3>Room ${b.room_number}</h3>
                    ${b.check_in ? `<p>Check In: ${new Date(b.check_in).toLocaleDateString('en-IN', {day:'numeric',month:'long'})}</p>` : ''}
                    ${b.check_out ? `<p>Check Out: ${new Date(b.check_out).toLocaleDateString('en-IN', {day:'numeric',month:'long'})}</p>` : ''}
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <span class="badge badge-${b.status}">STATUS: ${b.status.toUpperCase()}</span>
                    ${b.status === 'booked' ? 
                        `<button onclick="cancelBooking(${b.id})" 
                             style="padding:8px 16px; background:transparent; border:1px solid #ef4444; 
                             color:#ef4444; border-radius:20px; cursor:pointer; font-size:0.8rem;">
                             Cancel
                         </button>` : ''}
                </div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('bookings-list').innerHTML = 
            '<p style="color:red;">Could not load bookings.</p>';
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const res = await fetch(`http://localhost:5000/bookings/${bookingId}/cancel`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (res.ok) {
            alert('Booking cancelled.');
            loadMyBookings(); // Refresh the list
        }
    } catch (err) {
        alert('Could not cancel booking. Try again.');
    }
}

loadMyBookings();