// ============================================
// routes/settings.js
// ============================================

const express = require('express');
const router  = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const { getSettings, updateSettings, changePassword } = require('../controllers/settingsController');

router.get('/',           verifyAdmin, getSettings);
router.put('/',            verifyAdmin, updateSettings);
router.put('/password',    verifyAdmin, changePassword);

module.exports = router;