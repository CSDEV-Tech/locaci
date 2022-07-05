/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withTM = require("next-transpile-modules")(["@locaci/ui"]);
module.exports = withTM(nextConfig);
// module.exports = nextConfig;
