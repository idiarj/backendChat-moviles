import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { FsUtils } from "../utils/fsUtils.js";
import { userRouter } from "../routers/dispatcher.js";
const cors_config = await FsUtils.readJsonFile('./config/cors_config.json');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(cors_config));


app.use('/user', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});

