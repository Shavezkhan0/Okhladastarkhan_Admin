import conn_to_mon from "@/features/mongoose";
import ShopUser from "@/models/ShopUser";

export default async function activeShop(req, res) {
  try {
    await conn_to_mon();
    const { email } = req.body;

    const decodedEmail = decodeURIComponent(email);

    
    
    const userExist = await ShopUser.findOneAndUpdate(
        { email: decodedEmail },
        { $set: { active: "true" } },
        { new: true }
    );
    

    res.status(200).json({ success: true, message: "Shop Activated" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error signing up user", error });
  }
}
