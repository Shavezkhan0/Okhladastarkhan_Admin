import ShopUser from "@/models/ShopUser";
import mongoose from "mongoose";

export default async function getUser(req, res) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGOOSE_CONN_STRING, {
      dbName: "okhaladastarkhan",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    let shops = await ShopUser.find({ shop: "on", active: "true" });

    res.status(200).json({
      success: true,
      message: "Shops find Successfully",
      shops: shops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hoodies" });
  }
}
