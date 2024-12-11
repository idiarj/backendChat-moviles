import { FsUtils } from "../utils/fsUtils.js";
import express from 'express';

const cors_config = await FsUtils.readJsonFile('./config/cors_config.json');
