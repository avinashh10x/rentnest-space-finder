const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }
    // Handle Bearer prefix
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }
        if (user.role !== 'admin') {
            return res.status(403).send({ message: 'Require Admin Role!' });
        }
        next();
    });
};




