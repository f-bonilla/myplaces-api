const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    web: { type: String, default: "" },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceState",
      required: true,
    },
    province: { type: String, required: true },
    locality: { type: String, required: true },
    place_option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceOption",
      required: true,
    },
    place_option_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceOptionType",
      required: true,
    },
    public: { type: Boolean, required: true, default: 1 },
    votes: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Place", placeSchema, "places");
