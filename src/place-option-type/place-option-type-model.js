const mongoose = require("mongoose");

const placeOptionTypeSchema = new mongoose.Schema(
  {
    parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlaceOption",
    required: true,
  },
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
