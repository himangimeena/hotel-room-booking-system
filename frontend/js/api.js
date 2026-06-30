/* ================================================
   js/api.js  –  Shared helpers used by ALL pages
   Include this as the FIRST script tag on every
   HTML page:  <script src="js/api.js"></script>
   ================================================ */

// ── BASE URL ──────────────────────────────────────
// Change this once when you deploy to production
const BASE_URL = 'http://localhost:5000';

// ── SESSION HELPERS ───────────────────────────────
const getToken = ()  => localStorage.getItem('token');
const getUser  = ()  => JSON.parse(localStorage.getItem('user') || 'null');

const saveSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const logout = () => {
  clearSession();
  window.location.href = 'index.html';
};

// ── ROUTE GUARDS ──────────────────────────────────
const requireLogin = () => {
  if (!getToken()) { window.location.href = 'index.html'; return false; }
  return true;
};

const requireAdmin = () => {
  if (!getToken()) { window.location.href = 'index.html'; return false; }
  const u = getUser();
  if (!u || u.role !== 'admin') { window.location.href = 'rooms.html'; return false; }
  return true;
};

// ── FETCH WRAPPER ─────────────────────────────────
// All API calls go through here so we only write
// headers and error handling ONCE.
const apiFetch = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// ── ALERT HELPERS ─────────────────────────────────
const showAlert = (id, msg, type = 'error') => {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className   = `alert alert-${type} show`;
  if (type === 'success') setTimeout(() => { el.className = 'alert'; }, 4000);
};

const hideAlert = (id) => {
  const el = document.getElementById(id);
  if (el) el.className = 'alert';
};

// ── DATE HELPERS ──────────────────────────────────
const fmtDate = (str) => {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const todayISO = () => new Date().toISOString().split('T')[0];

// ── LOADING SPINNER HTML ──────────────────────────
const spinnerHTML = () => `
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p>Loading…</p>
  </div>`;
