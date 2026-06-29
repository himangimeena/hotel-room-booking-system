const API = 'http://localhost:5000';

function showAlert(containerId, message, type) {
    const box = document.getElementById(containerId);
    box.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showAlert('alert-box', 'Please fill in all fields', 'error');
        return;
    }

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showAlert('alert-box', data.message, 'error');
            return;
        }

        // Save token and user info in browser storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'rooms.html';
        }
    } catch (err) {
        showAlert('alert-box', 'Could not connect to server. Is the backend running?', 'error');
    }
}

async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (!name || !email || !password) {
        showAlert('alert-box', 'Please fill in all fields', 'error');
        return;
    }

    if (password !== confirm) {
        showAlert('alert-box', 'Passwords do not match', 'error');
        return;
    }

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showAlert('alert-box', data.message, 'error');
            return;
        }

        showAlert('alert-box', 'Account created! Redirecting to login...', 'success');
        setTimeout(() => window.location.href = 'index.html', 2000);
    } catch (err) {
        showAlert('alert-box', 'Could not connect to server', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Get saved token for API calls
function getToken() {
    return localStorage.getItem('token');
}

// Protect pages – redirect to login if not logged in
function requireLogin() {
    if (!getToken()) {
        window.location.href = 'index.html';
    }
}