/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["tss-react"]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: [process.env.HOST, process.env.IMAGE_HOST],
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    IMAGES_SOURCE_URL: process.env.IMAGES_SOURCE_URL,
  },
};

module.exports = withPlugins([withTM], nextConfig);
