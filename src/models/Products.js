import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  public_id: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
});

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    shop: { type: String, default: "off" },
    active: { type: String, required: true },
    shopname: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true }, // Corrected typo: descriptoion to description
    image: {
      type: [imageSchema],
      default: [],
      // required: true,
    },
    category: { type: String, required: true },
    foodCategory: { type: String, required: true },
    shopType: { type: String, default: "food" },
    price: { type: Number, required: true },
    availability: {
      type: Number,
      required: true,
      set: (value) => (value === "unlimited" ? Infinity : value), // Converts "unlimited" to Infinity
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
