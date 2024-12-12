import { UserModel } from '../models/userModel.js';
import { Validation } from '../utils/validation.js';
import { userSchema } from '../models/Schemas/userSchemas.js';
import { ChatSchema } from "../models/Schemas/ChatSchema.js";
import { ChatModel } from '../models/ChatModel.js';
import { jwtToken } from '../utils/tokens.js';



const validateMessage = new Validation(ChatSchema);
const validateUser = new Validation(userSchema);

export class UserController {


    static async registerUser(req, res) {
        try {

            await validateUser.validatePartial(req.body);

            const { username, password, email, firstName, lastName, birthDate, description, gender, interestedIn, imageUrl } = req.body;

            const verifiedUser = await UserModel.verifyUser({ username });
            const userAlreadyExists = verifiedUser.isUserValid;

            if (userAlreadyExists) return res.status(400).json({ success: false, error: "El nombre de usuario ya existe." });
            const emailAlreadyInUse = await UserModel.verifyEmail({ email: req.body.email });

            if (emailAlreadyInUse) return res.status(400).json({ success: false, error: "El correo ya esta en uso." });


            console.log({
                username,
                password,
                email,
                firstName,
                lastName,
                birthDate,
                description,
                gender,
                interestedIn,
                imageUrl
            })
            const user = await UserModel.registerUser({
                username,
                password,
                email,
                firstName,
                lastName,
                birthDate,
                description,
                gender,
                interestedIn,
                profilePicture: imageUrl
            });

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
                res.clearCookie('access_token');
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
            const token = jwtToken.generateToken({ payload: { id: user._id, username: user.username, interestedIn: user.interestedIn }, expiresIn: '1h' });
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
            console.log('session cerrada')
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
            const validToken = jwtToken.generateToken({ payload: { answerIsValid }, expiresIn: '5m' });
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
            const changePass_token = jwtToken.generateToken({ payload: { email }, expiresIn: '5m' });
            res.cookie('changePass_token', changePass_token);
            return res.status(200).json({success: true, message: 'Correo verificado.'})
        } catch (error) {
            console.log(error)
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

    static async patchDescription(req, res){
        try {
            const {id} = req.user;
            const {description} = req.body;
            const data = await UserModel.editDescription({newDescription: description, userId: id});

            res.status(200).json({
                ...data
            })
        } catch (error) {
            res.status(400).json({success: false, error: error.message})
        }
    }

    static async getInterestedIn(req, res){
        try {
            console.log('aqui')
            let users;
            console.log(req.user)
            const {interestedIn, id} = req.user;
            switch (interestedIn) {
                case 'Mujer':
                    users = await UserModel.getWomen({ userId: id });
                    break;
                case 'Hombre':
                    users = await UserModel.getMen({ userId: id });
                    break;
                default:
                    users = await UserModel.getBoth({ userId: id });
                    break;
            }
            console.log(users)
            return res.status(200).json({success: true, data: users});
        } catch (error) {
            console.log(error)
            res.status(400).json({success: false, error: error.message})
        }
    }

    static async likeUser(req, res){
        try {
            console.log(req.body)
            const {id} = req.user;
            const {matchId} = req.body;
            const data = await UserModel.matchUser({userId: id, matchId});
            const { match } = await UserModel.setUpMatch({userId: id, matchId});
            if(match){
                const chat = await ChatModel.createChat({id_user1: id, id_user2: matchId});
                console.log(chat)
            }
            res.status(200).json({
                ...data,
                match
            })
        } catch (error) {
            res.status(400).json({success: false, error: error.message})
        }
    }

    static async getMatches(req, res){
        try {
            const {id} = req.user;
            console.log(id)
            const matches = await UserModel.getMatches({id_user: id});
            res.status(200).json({
                success: true,
                data: matches
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({success: false, error: error.message})
        }
    }   

    static async getChats(req, res){
        try {
            console.log('a')
            const {id} = req.user;
            const chats = await ChatModel.getChats({id_user: id});
            console.log(chats)
            res.status(200).json({
                success: true,
                data: chats
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({success: false, error: error.message})
        }
    }
}