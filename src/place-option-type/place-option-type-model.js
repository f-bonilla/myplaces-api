const mongoose = require("mongoose");

const placeOptionTypeSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "PlaceOptionType",
  placeOptionTypeSchema,
  "place_option_types",
);
