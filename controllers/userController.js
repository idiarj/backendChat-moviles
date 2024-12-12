import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserModel } from '../models/userModel.js';
import { validateUser } from '../../instances/validation/iValidation.js';
// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lee el archivo JSON y parsea su contenido
const jwtConfigPath = path.resolve(__dirname, '../../config/jwt-config.json');
const jwtConfig = JSON.parse(fs.readFileSync(jwtConfigPath, 'utf-8'));

export class UserController {

    static async registerUser(req, res) {
        try {
            console.log('lo que me esta lleando en el body:', req.body);
            const verifiedUser = await UserModel.verifyUser({ username: req.body.username });
            const userAlreadyExists = verifiedUser.isUserValid;
            console.log('a', userAlreadyExists);
            if (userAlreadyExists) return res.status(400).json({ success: false, error: "El nombre de usuario ya existe." });
            const emailAlreadyInUse = await UserModel.verifyEmail({ email: req.body.email });
            console.log('b', emailAlreadyInUse);
            if (emailAlreadyInUse) return res.status(400).json({ success: false, error: "El correo ya esta en uso." });

            const { username, password, email } = req.body;

            await validateUser.validateTotal(req.body);

            const user = await UserModel.registerUser({
                username,
                password,
                email
            });
            console.log('lo que ingresare en la bd:', user);
            res.status(200).json({
                success: true,
                message: "User registered successfully",
                data: user
            });
        } catch (error) {
            console.error('el error es', error.issues[0].message)
            res.status(400).json({ success: false, error: error.issues[0].message });
        }
    }

    static async loginUser(req, res) {
        try {
            const alreadyInUseToken = req.cookies.access_token;
            console.log('token', alreadyInUseToken);
            if (alreadyInUseToken) {
                res.clearCookie('access_token'); // Elimina la cookie del token
                return res.status(400).json({ success: false, message: "Ya hay una sesion iniciada.", error: "Hubo un error, por favor intenta de nuevo." });
            }
            await validateUser.validatePartial(req.body)
            const { username, password } = req.body;
            console.log(req.body)
            const { isUserValid, user } = await UserModel.verifyUser({ username });
            const isPasswordValid = await UserModel.verifyPassword({ username, password });
            console.log('isUserValid', isUserValid);
            console.log('isPasswordValid', isPasswordValid);
            if (!isUserValid || !isPasswordValid) {
                console.log('entro en el if')
                return res.status(400).json({ success: false, error: "Usuario o contrasena incorrecta, por favor intentelo de nuevo." });
            }

            console.log(user._id, user.username);
            const token = jwt.sign({ id: user._id, username: user.username }, jwtConfig.secret, jwtConfig.options);
            console.log(token)
            res.cookie('access_token', token);
            res.status(200).json({ success: true, message: `Inicio de sesion con el usuario ${user.username} exitoso.` });
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false, message: error.message.message });
        }
    }

    static async logoutUser(req, res) {
        try {
            const token = req.cookies.access_token;
            if (!token) return res.status(400).json({ success: false, message: "No hay ninguna sesion iniciada." });
            res.clearCookie('access_token');
            res.status(200).json({ success: true, message: "Sesion cerrada exitosamente." });
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, message: error.message });
        }   
    }

    static async getUser(req, res) {
        try {
            console.log(req.user)
            const userId = req.user.id;
            const user = await UserModel.getUser({ userId });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.log(error)
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async setSecurityQuesion(req, res){
        try {
            const {email, question, answer} = req.body;
            await UserModel.setSecurityQuestion({email, question, answer});
            res.status(200).json({success: true, message: 'Pregunta de seguridad establecida exitosamente.'});
        } catch (error) {
            res.status(400).json({success: false, error: 'Error al establecer la pregunta de seguridad.', detella: error.message});
        }
    }

    static async getSecurityQuestion(req, res) {
        try {
            // Verifica que req.email esté definido
            console.log('entre a getSecurityQuestion controller')
            if (!req.email) {
                return res.status(400).json({ success: false, message: 'El correo electrónico no está definido.' });
            }
            console.log(req.cookies)
            console.log('req.email es', req.email);
            const { email } = req;
            console.log('el email es',email);
    
            // Obtén la pregunta de seguridad del modelo
            const question = await UserModel.getSecurityQuestion({ email });
            console.log(question);
    
            // Responde con la pregunta de seguridad
            res.status(200).json({ success: true, question });
        } catch (error) {
            console.error('Error al obtener la pregunta de seguridad:', error);
            res.status(400).json({ success: false, message: 'Hubo un error al obtener la pregunta de seguridad.', detalle: error.message });
        }
    }

    static async answerSecurityQuestion(req, res){
        try {
            console.log('entre a answerSecurityQuestion controller');
            
            const { answer } = req.body;
            const {email} = req;
            console.log('la respuesta es',answer)
            console.log('correo es',email)
            const answerIsValid = await UserModel.answerSecurityQuestion({email, answer});
            console.log(answerIsValid);
            if (!answerIsValid) {
                return res.status(400).json({ success: false, message: "La respuesta de seguridad es incorrecta." });
            }
            const validToken = jwt.sign({ answerIsValid }, jwtConfig.secret, { expiresIn: '5m' });
            res.cookie('validityToken', validToken);
            res.status(200).json({success: true, message: 'Respuesta de seguridad correcta.'});
        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    }

    static async putUser(req, res){
        try {
            console.log(req.body)
            await validateUser.validatePartial(req.body)
            const {username, email} = req.body
            const userId = req.user.id
            const user = await UserModel.updateProfile({
                newUsername: username,
                newEmail: email,
                userId
            })
            console.log(user)
            res.status(200).json({
                ...user
            })
        } catch (error) {
            res.status(400).json({
                error: 'Error al actualizar el usuario, por favor intente de nuevo.',
                detalle: error.message
            })
        }
    }

    static async patchPassword(req, res){
        try {
            console.log('holi')
            // const alreadyInUseToken = req.cookies.validityToken;
            // console.log(req.cookies)
            // console.log('token', alreadyInUseToken);
            // if (alreadyInUseToken) {
            //     res.clearCookie('validityToken'); // Elimina la cookie del token
            //     return res.status(400).json({ success: false, message: "Ya hay una sesion iniciada.", error: "Hubo un error, por favor intenta de nuevo." });
            // }
            const {validity} = req
            if(!validity) return res.status(400).json({success: false, error: 'Acceso denegado.'})
            await validateUser.validatePartial(req.body)
            const {password} = req.body
            const {email} = req
            const data = await UserModel.updatePassword({
                email,
                newPassword: password
            })
            console.log('data en patch password es', data)
            res.status(200).json({
                ...data
            })
        } catch (error) {
            res.status(400).json({
                error: `Error al cambiar tu contrasena, ${error.issues[0].message}.`,
                detalle: error.message
            })
        }
    }

    static async verifyEmail(req, res){
        try {
            console.log('verify email controller')
            console.log(req.body)
            const alreadyInUseToken = req.cookies.changePass_token
            console.log('req.cookies antes',req.cookies)
            console.log(alreadyInUseToken)
            if(alreadyInUseToken) {
                res.clearCookie('changePass_token')
                return res.status(400).json({success: false, error: 'Ya hay un token en uso.'})
            }
            const { email } = req.body
            const emailExists = await UserModel.verifyEmail({ email })
            if(!emailExists) return res.status(400).json({success: false, error: 'El correo no esta registrado.'})
            const changePass_token = jwt.sign({ email }, jwtConfig.secret, { expiresIn: '5m' })
            res.cookie('changePass_token', changePass_token);
            return res.status(200).json({success: true, message: 'Correo verificado.'})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Error al verificar el correo.', detalle: error.message})
        }
    }

    static async deleteUser(req, res){
        try {
            const { id } = req.user;
            console.log(id)
            console.log(req.cookies.access_token)
            if(req.cookies.access_token){
                res.clearCookie('access_token');
            }
            console.log(req.cookies.access_token)
            await ComentaryModel.deleteComentaries({userId: id});
            await UserModel.deleteUser({ userId: id });
            res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente.' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

}