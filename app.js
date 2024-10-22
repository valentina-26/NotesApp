const express = require('express');
const noteRouter = require('./api/router/noteRouter')
const userRouter = require('./api/router/userRouter')
const {} = require("./api/middleware/errorHandler")
const https = require('https');
const fs = require('fs');

// Cargar certificado y clave privada
const privateKey = fs.readFileSync('./private.key');
const certificate = fs.readFileSync('./certificate.crt');
const app = express();

app.use(express.json())
app.use(error.jsonParseErrorHandler);

app.use("/notes", noteRouter)
app.use("/users", userRouter)

// Crear servidor HTTPS
const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

httpsServer.listen(3000,()=>{
    console.log('https://localhost:3000');
})