// ============================================
// server.js  (UPDATED)
// Added: customers, revenue, settings routes
// ============================================

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ── ROUTES ─────────────────────────────────
app.use('/auth',      require('./routes/auth'));
app.use('/rooms',     require('./routes/rooms'));
app.use('/bookings',  require('./routes/bookings'));
app.use('/customers', require('./routes/customers'));   // NEW
app.use('/revenue',   require('./routes/revenue'));     // NEW
app.use('/settings',  require('./routes/settings'));    // NEW

app.get('/', (req, res) => {
    res.json({
        message: '🏨 Azure Haven API is running!',
        version: '2.0.0',
        endpoints: {
            auth:      ['POST /auth/register', 'POST /auth/login'],
            rooms:     ['GET /rooms', 'GET /rooms/admin', 'POST /rooms', 'PUT /rooms/:id', 'PATCH /rooms/:id/status', 'DELETE /rooms/:id'],
            bookings:  ['POST /bookings', 'GET /bookings/my-bookings', 'GET /bookings/all', 'GET /bookings/stats',
                        'PATCH /bookings/:id/approve', 'PATCH /bookings/:id/complete', 'PATCH /bookings/:id/cancel'],
            customers: ['GET /customers', 'GET /customers/:id', 'PATCH /customers/:id/block'],
            revenue:   ['GET /revenue', 'GET /revenue/reports'],
            settings:  ['GET /settings', 'PUT /settings', 'PUT /settings/password']
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('');
    console.log('🏨 ================================');
    console.log(`   Azure Haven API v2.0`);
    console.log(`   http://localhost:${PORT}`);
    console.log('🏨 ================================');
    console.log('');
});
