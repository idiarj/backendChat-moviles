import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const createConnectionToMongo = async (uri) => {
    try { 
        return mongoose.createConnection(uri);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const connectionToMongo = await createConnectionToMongo(process.env.MONGO_URI);