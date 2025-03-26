import conn_to_mon from "@/features/mongoose";
import Order from "@/models/Order";

export default async function getOrdes(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();

    
    const Orders = await Order.find({
      "shopDetails.shopemail": req.body.email,
    });
    

    res.status(200).json({ Orders });
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
