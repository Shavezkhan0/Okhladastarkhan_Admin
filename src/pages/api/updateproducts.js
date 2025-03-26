import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function updateproducts(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();
    for (let i = 0; i < req.body.length; i++) {
      let product = await Products.findByIdAndUpdate(req.body[i]._id, req.body[i]);
    }

    res.status(200).json({ success: "Product Update successfully" });
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
