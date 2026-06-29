// ============================================
// controllers/userController.js
//
// Controllers contain the BUSINESS LOGIC.
// They use Models to read/write data, then
// send back an HTTP response.
//
// Flow:  Request → Route → Controller → Model → Database
// ============================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/user');

// ── REGISTER ────────────────────────────────
// POST /auth/register
// Creates a new customer account
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate input — all fields required
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // 2. Password must be at least 6 characters
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // 3. Check if email already registered
        const exists = await User.emailExists(email);
        if (exists) {
            return res.status(409).json({ message: 'Email already registered. Please log in.' });
        }

        // 4. Hash the password — NEVER store plain text passwords
        //    The "10" is the "salt rounds" — higher = more secure but slower
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Save to database
        const newUserId = await User.create({ name, email, password: hashedPassword });

        // 6. Send success response
        res.status(201).json({
            message: 'Account created successfully! You can now log in.',
            userId: newUserId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// ── LOGIN ────────────────────────────────────
// POST /auth/login
// Verifies credentials and returns a JWT token
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 2. Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            // Use a vague message for security (don't reveal which field is wrong)
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Compare entered password with hashed password in DB
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Create JWT token — expires in 24 hours
        //    The token stores user info so we don't need to hit the DB on every request
        const token = jwt.sign(
            {
                id:    user.id,
                name:  user.name,
                email: user.email,
                role:  user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. Send token + user info back to frontend
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id:    user.id,
                name:  user.name,
                email: user.email,
                role:  user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { register, login };
