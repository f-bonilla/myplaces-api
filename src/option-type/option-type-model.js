const mongoose = require("mongoose");

const placeOptionTypeSchema = new mongoose.Schema(
  {
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceOption",
      required: true,
    },
    label: {
      translated: { type: Boolean },
      text: { type: String, unique: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "PlaceOptionType",
  placeOptionTypeSchema,
  "option_types",
);
