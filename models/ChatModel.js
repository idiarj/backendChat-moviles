import { Chat } from "../database/Schemas/Chats.js";
export class ChatModel {
    static async createChat({id_user1, id_user2}){
        try {
            const chat = await Chat.create({id_user1, id_user2});
            return chat;
        } catch (error) {
            throw error;
        }
    }

    static async getMatches({id_user}){
        try {
            const matches = await Chat.find({$or: [{id_user1: id_user}, {id_user2: id_user}]})
            return matches;
        } catch (error) {
            throw error;
        }
    }

    static async getChats({id_user}){
        try {
            const chats = await Chat.find({$or: [{id_user1: id_user}, {id_user2: id_user}]}).populate('id_user1').populate('id_user2');
            return chats;
        } catch (error) {
            throw error;
        }
    }
}
