import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  env: {
    NEAR_AI_MESSAGE: process.env.NEAR_AI_MESSAGE,
    NEAR_AI_RECIPIENT: process.env.NEAR_AI_RECIPIENT,
    NEAR_AI_CALLBACK_URL: process.env.NEAR_AI_CALLBACK_URL,
  },
};

export default nextConfig;
