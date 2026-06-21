const jwt = require('jsonwebtoken');
console.log("JWT_SECRET =", process.env.JWT_SECRET);
// This function checks if the user is logged in (has a valid token)
function verifyToken(req, res, next) {
    // Get the token from the request header
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: 'No token, access denied' });
    }

    try {
        // Remove "Bearer " from the token string
        const cleanToken = token.replace('Bearer ', '');
        // Verify and decode the token
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.user = decoded; // Save user info for later use
        next(); // Continue to the actual route
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// Check if user is an admin
function verifyAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    });
}

module.exports = { verifyToken, verifyAdmin };