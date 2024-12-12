import { Schema } from 'mongoose';
import { connectionToMongo } from '../connection.js';

const userSchema = new Schema({
    fullName: {
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
    genre: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    genrePreference: {
        type: String,
        required: true
    },
    securityData: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }
})

export const User = connectionToMongo.model('User', userSchema);