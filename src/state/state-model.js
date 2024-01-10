const mongoose = require("mongoose");

const placeStateSchema = new mongoose.Schema(
  {
    category_id: { type: String, unique: true },
    label: {
      translated: { type: Boolean },
      text: { type: String, unique: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PlaceState", placeStateSchema, "states");
