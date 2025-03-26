import conn_to_mon from "@/features/mongoose";
import ShopUser from "@/models/ShopUser";

export default async function updateuseraddress(req, res) {
  try {
    await conn_to_mon();
    const { email, address, landmark, pincode, city, state, country } =
      req.body;


    const userExist = await ShopUser.findOneAndUpdate(
      { email: email },
      {
        $set: {
          address: address,
          landmark: landmark,
          pincode: pincode,
          city: city,
          state: state,
          country: country,
        },
      },
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
