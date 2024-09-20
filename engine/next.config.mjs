/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                "reimagined-waddle-w4pxrpv699vfgwj-3000.app.github.dev",
                "http://localhost:3000",
            ],
        }
    },
};

export default nextConfig;
