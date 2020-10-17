const jwt = require('jsonwebtoken');
const Token = require('../models/auth');
const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied.No token provided.');
    const ttl = await Token.findOne({ token });
    console.log(ttl);
    if (!ttl) return res.status(401).send('Access denied.Time Expire');
    try {
        const jwtVerify = await jwt.verify(token, process.env.JWT_CONFIG);
        req.user = jwtVerify;
        next();
    } catch (err) {
        res.status(401).send('Access denied.Invalid token.');
    }
};

module.exports = auth;
