/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure the Image component to allow images from remote domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
