import { jwtToken } from "../utils/tokens.js";


export const changePasswordMiddleware = async (req, res, next) => {
    console.log('changepassmid')
    try {
        
        const token = req.cookies.validityToken;
        const decoded = jwtToken.verifyToken({ token });
        req.validity = decoded.answerIsValid;
        if (!token) return res.status(401).json({ success: false, message: "Acceso denegado. No se proporcionó token." });
        next();
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('validityToken');
            return res.status(401).json({ success: false, message: "Token expirado. Por favor, solicite un nuevo enlace de cambio de contraseña." });
        }
        res.status(401).json({ success: false, message: "Token inválido." });
    }
}