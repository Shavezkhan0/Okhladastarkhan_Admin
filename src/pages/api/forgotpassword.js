import conn_to_mon from "@/features/mongoose";
import User from "@/models/ShopUser";

export default async function addproducts(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    await conn_to_mon();

    const IsEmailExist = await User.findOne({ email: email });
    if (IsEmailExist) {
      res.status(200).json({ Message: "User Exist", success: true });
    } else {
      res.status(400).json({ Message: "You are not registered" });
    }
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
