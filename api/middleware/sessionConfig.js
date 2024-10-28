const session = require('express-session');
const fs = require("fs");
const SECRET_KEY = fs.readFileSync('./certificate.csr');

const sessionConfig = session({
    secret: SECRET_KEY.toString('utf8'),
    resave: false,
    saveUninitialized: false, // Cambiado a false para evitar crear sesiones vacías
    cookie: { 
        secure: true,        // Para HTTPS
        httpOnly: true,      // Previene acceso desde JavaScript del cliente
        maxAge: 1800000,     // 30 minutos
        sameSite: 'strict'   // Protección adicional contra CSRF
    },
    name: 'sessionId',       // Nombre personalizado de la cookie
    rolling: true           // Renueva el tiempo de expiración en cada request
});

module.exports = sessionConfig;
