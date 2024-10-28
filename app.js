const express = require('express');
const indexRouter = require('./api/views/indexRouter.js'); 
const noteRouter = require('./api/router/noteRouter.js');
const userRouter = require('./api/router/userRouter.js');
const error = require('./api/middleware/errorHandler.js');
const session = require('./api/middleware/sessionConfig.js');
const auth = require('./api/middleware/decodedJWT.js')
const https = require('https');
const fs = require('fs');
const path = require('path'); 
const app = express();

// Middleware para JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", indexRouter);
app.use("/notes",auth, noteRouter);
app.use("/users", userRouter);

// Manejar errores de JSON
app.use(session);
app.use(error.jsonParseErrorHandler);

// Usar path.join para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client/dist')));

// Servir archivos estáticos para Vue
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Cargar certificado y clave privada
const privateKey = fs.readFileSync('./private.key');
const certificate = fs.readFileSync('./certificate.crt');

// Crear servidor HTTPS
const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

// Configuración del servidor
const config = {
    host: process.env.EXPRESS_HOST || 'localhost',
    port: process.env.EXPRESS_PORT || 3000
};

// Iniciar el servidor
httpsServer.listen(config.port, config.host, () => {
    console.log(`https://${config.host}:${config.port}`);
});
