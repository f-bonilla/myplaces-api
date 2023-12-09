const i18n = require("i18n");
const mongoose = require("mongoose");
const { validateEmail } = require("../utils");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      set: (value) => value.trim(),
      validate: {
        validator: validateEmail,
        message: (props) => i18n.__("invalid_email", props.value),
      },
    },
    password: { type: String, required: true },
    role: { type: String, required: true },
    welcome_email: { type: Boolean, required: true },
    token: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema, "users");
