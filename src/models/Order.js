import mongoose, { Schema } from "mongoose";

const geolocationData = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: { type: Number, required: true },
    landmark: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    shopDetails: [
      {
        shopemail: {
          type: String,
          required: true,
        },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
          },
        ],
      },
    ],
    paymentInfo: {
      method: {
        type: String,
        default: "Pay on delivery",
      },
      paymentStatus: {
        type: String,
        default: "pending",
      },
    },
    products: {
      type: Object,
      required: true,
    },
    address: { type: String, required: true },
    geolocation: geolocationData,
    amount: { type: Number, required: true },
    deliveryamount: { type: Number, required: true },
    deliverystatus: {
      pack: {
        type: String,
        default: "pending",
      },
      shipped: {
        type: String,
        default: "pending",
      },
      deliver: {
        type: String,
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Orders || mongoose.model("Orders", OrderSchema);
