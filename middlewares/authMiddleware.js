import { jwtToken } from '../utils/tokens.js';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        console.log(token)
        if (!token) return res.status(401).json({ success: false, message: "Acceso denegado. No se proporcionó token." });
        
        const decoded = jwtToken.verifyToken({ token });
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('access_token'); // Elimina la cookie del token
            return res.status(401).json({ success: false, message: "Token expirado. Por favor, inicie sesión de nuevo." });
        }
        res.status(401).json({ success: false, message: "Token inválido." });
    }
};