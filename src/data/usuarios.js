const fs = require("fs");
const path = require("path");

const usuariosFilePath = path.join(__dirname, "../data/usuarios.json");

const usuariosJS = JSON.parse(fs.readFileSync(usuariosFilePath, "utf-8"));




module.exports =  usuariosJS;