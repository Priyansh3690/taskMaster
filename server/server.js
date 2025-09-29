import express from 'express';
import path from 'path';
import fromIndexRoutes from './routes/fromIndexRoutes.js';
import fromD_Routes from './routes/fromD_Routes.js';
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use("/", fromIndexRoutes);
app.use("/d", fromD_Routes);

import "./cron/cleanUpJob.js";
import "./cron/SendNotifiTotelegram.js";

app.listen(PORT, async () => {
    console.log(`Server running at https://localhost:${PORT}`);
});