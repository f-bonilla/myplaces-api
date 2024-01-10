const mongoose = require("mongoose");

const placeOptionSchema = new mongoose.Schema(
  {
    label: {
      translated: { type: Boolean },
      text: { type: String, unique: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PlaceOption", placeOptionSchema, "options");
