
import User from "@/models/User";
import mongoose from "mongoose";

export default async function getAllUsers(req, res) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGOOSE_CONN_STRING, {
      dbName: "okhaladastarkhan",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    let AllUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "User find Successfully",
      AllUsers: { AllUsers },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hoodies" });
  }
}
