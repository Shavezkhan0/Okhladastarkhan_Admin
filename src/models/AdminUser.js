import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
  {
    username: {
      type: String,
      // required: true,
    },
    active: { type: String, default: "false" },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", userSchema);
