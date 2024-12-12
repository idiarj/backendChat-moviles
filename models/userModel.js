import { User } from "../database/Schemas/userSchemaMongo.js";
import { CryptManager } from "../utils/CryptManager.js";
export class UserModel {


    static async registerUser({ username, password, email, firstName, lastName, gender, birthDate, description, profilePicture, interestedIn }) {
        try {
            password = await CryptManager.encriptarData({data: password});
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
                profilePicture
            })
            const user = await User.create({
                username,
                password,
                email,
                firstName,
                lastName,
                gender,
                birthDate,
                description,
                interestedIn,
                profilePicture
            });
            return user;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    static async verifyUser({ username }) {
        console.log('entre a verifyUser')
        try {
            let isUserValid;
            console.log(username) 
            console.log(new RegExp(`^${username}$`, 'i'))
            const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
            console.log(user)
            // console.log(isEmailValid)
            isUserValid = user ? true : false;
            return {isUserValid, user};
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    static async verifyPassword({ username, password }) {
        console.log('entre a verifyPassword')
        try {
            const passwordFromDB = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).select('password');
            console.log('passwordFromDB', passwordFromDB)
            if(!passwordFromDB) return null;
            console.log('passowrd es', password)
            const isPasswordValid = await CryptManager.compareData({ hashedData: passwordFromDB.password, toCompare: password });
            console.log('isPasswordValid', isPasswordValid)
            return isPasswordValid
        } catch (error) {
            console.log('el error que estoy teniendo es:', error)
            throw error;
        }
    }

    static async verifyEmail({ email }) {
        try {
            let isEmailValid;
            const user = await User. findOne({ email: new RegExp(`^${email}$`, 'i') });
            isEmailValid = user ? true : false;
            return isEmailValid;
        } catch (error) {
            console.log('entre aqui')
            throw error;
        }
    }

    static async getUser({userId}){
        try {
            const user = await User.findById(userId).select('-password  -securityData');
            return user;
        } catch (error) {
            
        }
    }

    static async setSecurityQuestion({ email, question, answer }) {
        try {
            console.log('entre a setSecurityQuestion');
            console.log(email);
            console.log(question);
            console.log(answer);

            const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
            if (!user) {
                throw new Error('User not found');
            }
            console.log(user)
            user.securityData = {
                question,
                answer
            };

            await user.save();
            console.log('Security question and answer set successfully');
        } catch (error) {
            console.error('Error setting security question:', error);
            throw error;
        }
    }

    static async getSecurityQuestion({email}){
        try {
            const data = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('securityData');
            console.log(data.securityData.question)
            const securityQuestion = data.securityData.question;
            return securityQuestion
        } catch (error) {
            console.log(error)
            throw new Error('Error al obtener la pregunta de seguridad')
        }
    }

    static async answerSecurityQuestion({email, answer}){
        try {
            console.log('entre al answerSecurityQuestion model')
            console.log(answer)
            console.log(email)
            const data = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('securityData');
            console.log(data)
            const answerFromDB = data.securityData.answer;
            if(answerFromDB !== answer){
                return false;
            }
            return true
        } catch (error) {
            throw error;
        }
    }

    static async updatePassword({email, newPassword}){
        try {
            console.log('entre a updatePassword')
            console.log('email es', email)
            console.log('newPassword es', newPassword)
            const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
            console.log(user)
            console.log('newPassoword antes de encrypt', newPassword)
            newPassword = await CryptManager.encriptarData({data: newPassword});   
            console.log('newPassword despues de encrypt', newPassword)
            user.password = newPassword;
            await user.save()
            return {success: true, mensaje: 'Contrasena actualizada correctamente'}
        } catch (error) {
            throw error;
        }
    }

    static async updateProfile({newUsername, newEmail, userId}){
        try {
            const user = await User.findById(userId);
            user.username = newUsername;
            user.email = newEmail;
            await user.save();
            return {success: true, mensaje: 'Usuario editado con exito.', user}
        } catch (error) {
            throw error;
        }
    }

    static async editDescription({newDescription, userId}){
        try {
            const oldDescription = await User.findById(userId).select('description');
            const user = await User.findById(userId);
            user.description = newDescription;
            await user.save();
            return {success: true, mensaje: 'Descripcion editada con exito.', oldDescription, newDescription}
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser({userId}){
        try {
            await User.findByIdAndDelete(userId);
            return {success: true, mensaje: 'Usuario eliminado con exito.'}
        } catch (error) {
            throw error;
        }
    }

    static async getWomen({ userId }) {
        try {
            const user = await User.findById(userId).select('Matches');
            const likedUsers = user.Matches;
    
            const women = await User.find({
                gender: 'Mujer',
                _id: { $nin: [...likedUsers, userId] }
            }).select('-password -securityData -Matches');
    
            return women;
        } catch (error) {
            throw error;
        }
    }

    static async getMen({ userId }) {
        try {
            const user = await User.findById(userId).select('Matches');
            const likedUsers = user.Matches;
    
            const men = await User.find({
                gender: 'Hombre',
                _id: { $nin: [...likedUsers, userId] }
            }).select('-password -securityData -Matches');
    
            return men;
        } catch (error) {
            throw error;
        }
    }

    static async getBoth({ userId }) {
        try {
            const user = await User.findById(userId).select('Matches');
            const likedUsers = user.Matches;
    
            const both = await User.find({
                _id: { $nin: [...likedUsers, userId] }
            }).select('-password -securityData -Matches');
    
            return both;
        } catch (error) {
            throw error;
        }
    }

    static async matchUser({userId, matchId}){
        try{
            console.log('userId',userId)
            console.log('matchId',matchId)
            const user = await User.findById(userId);
            user.Matches.push(matchId);
            await user.save();
            return {success: true, mensaje: 'Match realizado con exito.'}
        }catch(error){
            throw error;    
        }
    }

    static async setUpMatch({ userId, matchId }) {
        try {
            const user = await User.findById(userId);
            const match = await User.findById(matchId);

            if (user.Matches.includes(matchId) && match.Matches.includes(userId)) {
                await this.notifyMatch({ userId, matchId });

                return { match: true, mensaje: '¡Hay match!' };
            }
            return { match: false, mensaje: 'No hay match' };
        } catch (error) {
            throw error;
        }
    }

    static async notifyMatch({ userId, matchId }) {
        try {
            const user = await User.findById(userId);
            const match = await User.findById(matchId);

            // Aquí puedes agregar la lógica para notificar a ambos usuarios
            // Por ejemplo, enviar un correo electrónico, una notificación push, etc.
            console.log(`¡Hay match entre ${user.username} y ${match.username}!`);

            // Ejemplo de notificación por correo electrónico (requiere configuración adicional)
            // await EmailService.sendMatchNotification({ user, match });

        } catch (error) {
            console.error('Error al notificar el match:', error);
            throw error;
        }
    }

    static async getMatches({id_user}){
        try {
            console.log(id_user)
            const {Matches} = await User.findById(id_user).select('Matches').populate({
                path:'Matches',
                select: '-password -securityData -Matches'
            })
            // console.log(user)
            console.log(Matches)
            return Matches;
        } catch (error) {
            throw error;
        }
    }
}