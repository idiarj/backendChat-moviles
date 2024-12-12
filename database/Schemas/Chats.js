import { Schema } from 'mongoose';
import { connectionToMongo } from '../connection.js';
const chatSchema = new Schema({
    id_user1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id_user2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        message: {
            type: String
        },
        date: {
            type: Date
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})

export const Chat = connectionToMongo.model('Chat', chatSchema);