const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
  },
  { timestamps: true },
);

// TODO: ver comentarios, etc...
// INFO: esto se apunto en su momento por si hace falta traer aqui algun tipo de logica
// se podrian añadir metodos al modelo para operar desde fuera
//userRoleSchema.methods.identity = ()=>{};

module.exports = mongoose.model("UserRole", userRoleSchema, "user_roles");
