import { User } from "../utils/db/User.js";
import { CryptManager } from "../security/encrypting/Crypt.js";
import { Film } from "../utils/db/FIlm.js";
export class UserModel {

    static async registerUser({ username, password, email }) {
        try {
            password = await CryptManager.encriptarData({data: password});
            const user = await User.create({
                username,
                password,
                email
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
            const user = await User.findById(userId).select('-password');
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

    static async deleteUser({userId}){
        try {
            await User.findByIdAndDelete(userId);
            return {success: true, mensaje: 'Usuario eliminado con exito.'}
        } catch (error) {
            throw error;
        }
    }
}