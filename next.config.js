/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(js|d.ts)\.map$/,
        use: ['ignore-loader'],
      });
      
      config.module.rules.push({
        test: /\.d\.ts$/,
        use: ['ignore-loader'],
      });
      
      return config;
    },
  }
  
  module.exports = nextConfig