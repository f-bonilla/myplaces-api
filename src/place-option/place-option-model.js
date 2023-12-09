const mongoose = require("mongoose");

const placeOptionSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "PlaceOption",
  placeOptionSchema,
  "place_options",
);
