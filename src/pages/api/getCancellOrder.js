import conn_to_mon from "@/features/mongoose";
import Order from "@/models/Order";

export default async function cancelledOrder(req, res) {
  try {
    await conn_to_mon();

   
    const cancellOrder = await Order.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          "deliverystatus.pack": "cancelled",
          "deliverystatus.shipped": "cancelled",
          "deliverystatus.deliver": "cancelled",
        },
      },
      { new: true }
    );

    

    res.status(200).json({ success: true, message: "Order Cancelled" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Order not Cancelled", error });
  }
}
