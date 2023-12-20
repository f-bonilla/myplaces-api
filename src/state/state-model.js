const mongoose = require("mongoose");

const placeStateSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PlaceState", placeStateSchema, "states");
