import conn_to_mon from "@/features/mongoose";
import ShopUser from "@/models/ShopUser";

export default async function updateuserprofile(req, res) {
  try {

    await conn_to_mon();
    const { username, email, phoneNumber } = req.body;

    const userExist = await ShopUser.findOneAndUpdate(
      { email: email },
      { $set: { username: username, phoneNumber: phoneNumber } },
      { new: true }
    );



    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error signing up user", error });
  }
}
