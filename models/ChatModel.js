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


    static async getChats({id_user}) {
        try {
            const chats = await Chat.find({$or: [{id_user1: id_user}, {id_user2: id_user}]})
            .populate({
                path: 'id_user1',
                select: '_id username firstName lastName profilePicture',
                match: { _id: { $ne: id_user } } // Excluir el usuario actual
            })
            .populate({
                path: 'id_user2',
                select: '_id username firstName lastName profilePicture',
                match: { _id: { $ne: id_user } } // Excluir el usuario actual
            });

            // Filtrar chats sin usuarios
            const filteredChats = chats.filter(chat => chat.id_user1 || chat.id_user2);

            // Eliminar campos null
            const cleanedChats = filteredChats.map(chat => {
                const cleanedChat = chat.toObject();
                if (!cleanedChat.id_user1) delete cleanedChat.id_user1;
                if (!cleanedChat.id_user2) delete cleanedChat.id_user2;
                return cleanedChat;
            });

            return cleanedChats;
        } catch (error) {
            throw error;
        }
    }

    static async createMessage({id_chat, id_user, message}) {
        try {
            const chat = await Chat.findById(id_chat);
            if (!chat) throw new Error('Chat not found');
            console.log(message)
            chat.messages.push({id_user, message, date: new Date()});
            await chat.save();
            return chat;
        } catch (error) {
            throw error;
        }
    }

    static async getMessages({ id_chat, activeUserId }) {
        try {
            const chat = await Chat.findById(id_chat);
            if (!chat) throw new Error('Chat not found');
    
            const messagesWithSenderFlag = chat.messages.map(message => ({
                ...message.toObject(),
                isSender: message.sender.toString() === activeUserId
            }));
    
            return messagesWithSenderFlag;
        } catch (error) {
            throw error;
        }
    }
}
