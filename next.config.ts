import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // the rigs reach the dev server by ip when another local server holds localhost on the same port
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
