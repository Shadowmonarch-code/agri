import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow preview panel to access the dev server
  allowedDevOrigins: [
    "preview-chat-4ca7adf1-f4e5-4a29-85ec-92c800d131f5.space-z.ai",
  ],
};

export default nextConfig;
