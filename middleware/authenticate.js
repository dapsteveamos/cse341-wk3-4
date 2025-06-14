const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];  // Get the token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token using JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to the request
        next();  // Proceed to the next middleware or route
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};

module.exports = { isAuthenticated };
