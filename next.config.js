const dotenv = require('dotenv');

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API: process.env.URL,
  },
  modularizeImports: {
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/{{member}}',
    },
  },
};

module.exports = nextConfig;
