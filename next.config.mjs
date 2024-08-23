/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Outputs a Single-Page Application (SPA).
  distDir: "./dist", // Changes the build output directory to `./dist/`.
  antropicKey: process.env.NEXT_PUBLIC_ANTHROPIC_KEY,
};

export default nextConfig;
