import conn_to_mon from "@/features/mongoose";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export default async function signUp(req, res) {
  try {
    await conn_to_mon();
    const { username, email, phoneNumber, password } = req.body;

    
    const userExists = await AdminUser.findOne({ email: email });
    

    if (userExists) {
      return res.status(200).json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 5);

    try {
      const newUser = new AdminUser({
        username,
        email,
        phoneNumber,
        password: hashPassword,
      });
      await newUser.save();
      return res.status(200).json({ success: true, message: "User signed up successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error saving user", error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error signing up user", error });
  }
}
