import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  devIndicators: false,
};

export default nextConfig;
