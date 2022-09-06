import "dotenv/config";
import express from "express";
import "./database/connectdb.js";
import authRouter from './routes/authRoute.js';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);

app.use(express.static('public'))//solo para ejemplo de login

const PORT =process.env.PORT || 5000;
app.listen(PORT, () => console.log("Servidor Arriba 😎 http://localhost:" + PORT));