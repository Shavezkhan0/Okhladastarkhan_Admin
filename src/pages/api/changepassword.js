import conn_to_mon from "@/features/mongoose";
import ShopUser from "@/models/ShopUser";
import bcrypt, { hash } from "bcryptjs";

export default async function addproducts(req, res) {
  if (req.method === "POST") {
    const { password, email } = req.body;

    const hasPass = await bcrypt.hash(password, 5);

    await conn_to_mon();

    const user = await ShopUser.findOneAndUpdate(
      { email: email },
      { password: hasPass },
      { new: true }
    );

    if (!user) {
      res.status(400).json({ error: "User not found" });
    } else {
      res
        .status(200)
        .json({ message: "Password updated successfully", success: true });
    }
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
