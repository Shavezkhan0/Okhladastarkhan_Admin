import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }

  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ success: false, message: 'No public_id provided' });
  }

  try {
    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to delete image' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const config = {
  api: {
    bodyParser: true, // Ensure body parsing is enabled for JSON requests
  },
};

export default handler;
