import jwt from 'jsonwebtoken';

export default function validateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'unathorized.' });

    jwt.verify(token, "123456", function (err, decoded) {
        if (err) return res.status(401).json({ message: 'unathorized' });

        req.userId = decoded.id;
        next();
    });
}