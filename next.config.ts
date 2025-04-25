import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // for Google profile pics
      'avatars.githubusercontent.com',
    ],
  },
};

export default nextConfig;
