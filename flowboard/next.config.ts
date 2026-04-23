import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: [
    "@atlaskit/pragmatic-drag-and-drop",
    "@atlaskit/pragmatic-drag-and-drop-hitbox",
    "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator",
  ],
};

export default nextConfig;
