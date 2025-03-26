import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Initialize Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  const uploadMiddleware = upload.array("files");

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) reject(error);
            resolve(result);
          });
          stream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);
      const image = results.map((result) => ({
        secure_url: result.secure_url,
        public_id: result.public_id,
      }));

      return res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        image,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default handler;
