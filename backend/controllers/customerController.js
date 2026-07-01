// ============================================
// controllers/customerController.js
// Business logic for Customer Management
// ============================================

const Customer = require('../models/customer');

// GET /customers — admin only
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.getAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ message: 'Could not fetch customers' });
    }
};

// GET /customers/:id — admin only, full profile + booking history
const getCustomerProfile = async (req, res) => {
    try {
        const profile = await Customer.getProfile(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Could not fetch customer profile' });
    }
};

// PATCH /customers/:id/block — admin only, toggle block status
const toggleBlock = async (req, res) => {
    try {
        const { is_blocked } = req.body; // true to block, false to unblock

        if (typeof is_blocked !== 'boolean') {
            return res.status(400).json({ message: 'is_blocked must be true or false' });
        }

        const updated = await Customer.setBlocked(req.params.id, is_blocked);
        if (!updated) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({
            message: is_blocked ? 'Customer blocked successfully' : 'Customer unblocked successfully'
        });
    } catch (error) {
        console.error('Toggle block error:', error);
        res.status(500).json({ message: 'Could not update customer status' });
    }
};

module.exports = { getAllCustomers, getCustomerProfile, toggleBlock };
