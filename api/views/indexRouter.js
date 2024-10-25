const layout = require("express").Router();
const { join } = require("path");

// Servir el archivo index.html
layout.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../../client/dist/index.html"));
  console.log(join(__dirname, "../../client/dist/index.html"))

});

module.exports = layout;