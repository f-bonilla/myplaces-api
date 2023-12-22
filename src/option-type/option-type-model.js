const mongoose = require("mongoose");

const placeOptionTypeSchema = new mongoose.Schema(
  {
    parent_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceOption",
      required: true,
    },
    category_id: { type: String, unique: true },
    value: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "PlaceOptionType",
  placeOptionTypeSchema,
  "option_types",
);
