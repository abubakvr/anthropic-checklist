/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Outputs a Single-Page Application (SPA).
  antropicKey: process.env.NEXT_PUBLIC_ANTHROPIC_KEY,
};

export default nextConfig;
