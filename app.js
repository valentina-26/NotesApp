import express from 'express';
import indexRouter from './api/views/indexRouter.js'; 
const noteRouter = require('./api/router/noteRouter.js');
const userRouter = require('./api/router/userRouter.js');
import { jsonParseErrorHandler } from './api/middleware/errorHandler.js'; // Asumiendo que `errorHandler` exporta este middleware
import https from 'https';
import fs from 'fs';

// Cargar certificado y clave privada
const privateKey = fs.readFileSync('./private.key');
const certificate = fs.readFileSync('./certificate.crt');
const app = express();

app.use(express.json());
app.use(jsonParseErrorHandler); // Asegúrate de haber importado correctamente

app.use("/", indexRouter);
app.use("/notes", noteRouter);
app.use("/users", userRouter);

// Crear servidor HTTPS
const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

const config = {
    host: process.env.EXPRESS_HOST,
    port: process.env.EXPRESS_PORT
};

httpsServer.listen(config.port, config.host, () => {
    console.log(`https://${config.host}:${config.port}`);
});
