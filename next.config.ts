import { Protocol } from "@aws-sdk/client-s3";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {hostname: "lms-bucket.fly.storage.tigris.dev",
      port: '',
      protocol: "https"
    }
    ]
  }
};

export default nextConfig;
