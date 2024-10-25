const session = require('express-session');
const fs = require("fs");

const SECRET_KEY = fs.readFileSync('./certificate.csr');
module.exports = session({
  secret: SECRET_KEY.toString('utf8'), // Clave secreta para firmar la cookie de la sesión
  resave: false,  // No volver a guardar la sesión si no ha sido modificada
  saveUninitialized: true, // Guardar la sesión aunque no esté inicializada
  cookie: { secure: true, maxAge: 1800000 } // Si se usa HTTPS, debe ser true
});
