const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = (req, res, next) => {
    try {
        const SECRET_KEY = fs.readFileSync('./certificate.csr');
        var payload = jwt.verify(req.session.auth, SECRET_KEY.toString('utf8'));
        req.data = payload;
        next();
    } catch (error) {
        return res.status(401).json({status: 401, message: "Unauthorized"});
    }
};
