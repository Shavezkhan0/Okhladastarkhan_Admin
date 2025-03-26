import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function onproducttatus(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await conn_to_mon();

    const result = await Products.findByIdAndUpdate(req.body.Product_id, {
      shop: "on",
    });


    res.status(200).json({ success: true, message: "Product On" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating products", error });
  }
}
