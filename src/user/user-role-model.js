const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema(
  {
    role: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserRole", userRoleSchema, "user_roles");
