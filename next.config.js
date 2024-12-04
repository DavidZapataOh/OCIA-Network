/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|d.ts)\.map$/,
      use: ["ignore-loader"],
    });

    config.module.rules.push({
      test: /\.d\.ts$/,
      use: ["ignore-loader"],
    });

    return config;
  },
  env: {
    NEXT_PUBLIC_BRIAN_API_KEY: process.env.NEXT_PUBLIC_BRIAN_API_KEY,
    NEXT_PUBLIC_BRIAN_API_URL: process.env.NEXT_PUBLIC_BRIAN_API_URL,
  },
};

module.exports = nextConfig;
