import mongoose from 'mongoose';

const createConnectionToMongo = async (uri) => {
    try {
        console.log('uri',uri);  
        return mongoose.createConnection(uri);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const connectionToMongo = await createConnectionToMongo(process.env.MONGO_URI);