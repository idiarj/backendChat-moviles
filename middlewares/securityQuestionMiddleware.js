import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lee el archivo JSON y parsea su contenido
const jwtConfigPath = path.resolve(__dirname, '../../config/jwt-config.json');
const jwtConfig = JSON.parse(fs.readFileSync(jwtConfigPath, 'utf-8'));

export const securityQuestionMiddleware = async (req, res, next) => {
    console.log('entre a middleware question')
    try {
        const token = req.cookies.changePass_token;
        console.log('token es securiy middleware es', token)
        if (!token) return res.status(401).json({ success: false, message: "Acceso denegado. No se proporcionó token." });

        const decoded = jwt.verify(token, jwtConfig.secret);
        console.log('decoded en security middleware es', decoded)
        req.email = decoded.email;
        next();
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('changePass_token'); // Elimina la cookie del token
            return res.status(401).json({ success: false, message: "Token expirado. Por favor, solicite un nuevo enlace de cambio de contraseña." });
        }
        res.status(401).json({ success: false, message: "Token inválido." });
    }
};