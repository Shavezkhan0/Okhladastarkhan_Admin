import conn_to_mon from "@/features/mongoose";
import DeliveryUser from "@/models/DeliveryUser";


export default async function ActiveDelivery(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await conn_to_mon();

    const result = await DeliveryUser.findByIdAndUpdate(req.body._id, {
        active: "true",
    });


    res.status(200).json({ success: true, message: "Delivery Active" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating products", error });
  }
}
