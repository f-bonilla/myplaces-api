const mongoose = require("mongoose");

const placeStateSchema = new mongoose.Schema(
  {
    label: {
      translated: { type: Boolean },
      text: { type: String, unique: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PlaceState", placeStateSchema, "states");
