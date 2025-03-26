import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function activeHopProduct(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await conn_to_mon();
    const { email } = req.body;

    const decodedEmail = decodeURIComponent(req.body.email);
    

    const result = await Products.updateMany(
      { email: decodedEmail },
      { $set: { active: "true" } }
    );
    

    res.status(200).json({ success: true, message: "All Product Active", result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating products", error });
  }
}
