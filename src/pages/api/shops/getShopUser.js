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
    let shopUser = await ShopUser.findOne({ email: req.body.email });
    

    res.status(200).json({
      success: true,
      message: "ShopUser find Successfully",
      shopUser: { shopUser },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hoodies" });
  }
}
