import { Schema } from 'mongoose';
import { connectionToMongo } from '../connection.js';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    interestedIn: {
        type: String,
        required: true
    },
    securityData: {
        question: {
            type: String,
        },
        answer: {
            type: String,
        }
    },
    Matches: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

export const User = connectionToMongo.model('User', userSchema);