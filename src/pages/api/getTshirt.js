import mongoose from "mongoose";
import Products from "@/models/Products";

export default async function getTshirts(req, res) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGOOSE_CONN_STRING, {
      dbName: "okhaladastarkhan",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    let tshirts = await Products.find({ category: "tshirt" });
    res.status(200).json(tshirts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
