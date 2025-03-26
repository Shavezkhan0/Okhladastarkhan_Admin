import conn_to_mon from "@/features/mongoose";
import ShopUser from "@/models/ShopUser";

export default async function updateshopstatus(req, res) {
  try {
    await conn_to_mon();
    const { email } = req.body;

    const userExist = await ShopUser.findOneAndUpdate(
      { email: email },
      { $set: { shop: "on" } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Shop On" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error signing up user", error });
  }
}
