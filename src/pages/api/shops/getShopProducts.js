import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function getshopproducts(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();

  
    const products = await Products.find({ email: req.body.email });

    res.status(200).json({ products });
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
