const dotenv = require("dotenv");

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TOKEN_API_IMG: process.env.TOKEN_API_IMG,
  },
  modularizeImports: {
    "@phosphor-icons/react": {
      transform: "@phosphor-icons/react/{{member}}",
    },
  },
};

module.exports = nextConfig;
