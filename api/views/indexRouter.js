import express from 'express'; // Para ES Modules
const indexRouter = express.Router();
const { join } = require("path");

// Servir el archivo index.html
layout.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../../client/dist/index.html"));
  console.log(join(__dirname, "../../client/dist/index.html"))

});

export default indexRouter;