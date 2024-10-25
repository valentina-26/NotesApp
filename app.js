const express = require('express');
const indexRouter = require('./api/views/indexRouter.js'); 
const noteRouter = require('./api/router/noteRouter.js');
const userRouter = require('./api/router/userRouter.js');
const { jsonParseErrorHandler } = require('./api/middleware/errorHandler.js'); // Asegúrate de haber exportado correctamente
const https = require('https');
const fs = require('fs');
const path = require('path'); // Importar el módulo 'path'
const app = express();

// Middleware para JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar path.join para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client/dist')));

// Servir archivos estáticos para Vue
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Cargar certificado y clave privada
const privateKey = fs.readFileSync('./private.key');
const certificate = fs.readFileSync('./certificate.crt');

// Manejar errores de JSON
app.use(jsonParseErrorHandler); 

// Rutas
app.use("/", indexRouter);
app.use("/notes", noteRouter);
app.use("/users", userRouter);


// Crear servidor HTTPS
const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

// Configuración del servidor
const config = {
    host: process.env.EXPRESS_HOST || 'localhost', // Agregado valor por defecto
    port: process.env.EXPRESS_PORT || 3000 // Agregado valor por defecto
};

// Iniciar el servidor
httpsServer.listen(config.port, config.host, () => {
    console.log(`https://${config.host}:${config.port}`);
});
