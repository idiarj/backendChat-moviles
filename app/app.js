import { FsUtils } from "../utils/fsUtils.js";
import { userRouter } from "../routers/dispatcher.js";
import dotenv from 'dotenv';
import express from 'express';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});

const cors_config = await FsUtils.readJsonFile('./config/cors_config.json');
