/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/explorations/version-2/index.html', permanent: false },
      { source: '/version-1', destination: '/explorations/version-1/index.html', permanent: false },
      { source: '/version-2', destination: '/explorations/version-2/index.html', permanent: false },
    ];
  },
};
export default nextConfig;
