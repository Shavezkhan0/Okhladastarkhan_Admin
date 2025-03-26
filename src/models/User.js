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

const userSchema = new Schema(
  {
    username: {
      type: String,
      // required: true,
    },
    image: {
      type: [imageSchema],
      default: [],
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      // required: true,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    landmark: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
