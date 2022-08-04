import "dotenv/config";
import express from "express";
import "./database/connectdb.js";
import authRouter from './routes/authRoute.js'

const app = express();

app.use(express.json());
app.use('/api/v1', authRouter);

const PORT =process.env.PORT || 5000;
app.listen(PORT, () => console.log("Servidor Arriba 😎 http://localhost:" + PORT));