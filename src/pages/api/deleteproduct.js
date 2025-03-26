import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function getproducts(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();


    const product = await Products.findByIdAndDelete(req.body);

    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
