import conn_to_mon from "@/features/mongoose";
import User from "@/models/ShopUser";
import bcrypt, { hash } from "bcryptjs";

export default async function updateuserpassword(req, res) {
  try {
    await conn_to_mon();
    const { oldpassword, newpassword, email } = req.body;

    const userExist = await User.findOne({ email: email });
    
    const isMatch = await bcrypt.compare(oldpassword, userExist.password);
    if (!isMatch) {
         res.status(200).json({
          success: false,
          message: "Old password does not match",
        });
      }

    const hashNewPassword = await bcrypt.hash(newpassword, 5);
    userExist.password = hashNewPassword;
    await userExist.save();

    res.status(200).json({ success: true, message: "Passward updated" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error signing up user", error });
  }
}
