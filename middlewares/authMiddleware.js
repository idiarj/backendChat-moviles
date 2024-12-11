import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __filename y __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jwtConfigPath = path.resolve(__dirname, '../../config/jwt-config.json');
const jwtConfig = JSON.parse(fs.readFileSync(jwtConfigPath, 'utf-8'));

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token)
    if (!token) return res.status(401).json({ success: false, message: "Acceso denegado. No se proporcionó token." });

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
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