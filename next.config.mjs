/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Only bare hostnames are allowed here (no protocol or trailing slash)
        domains: [
            "admin.compares360.com",
            "images.versus.io",
            "www.svgrepo.com",
            "www.kalakarhouse.com",
            "randomuser.me",
        ],
    },
};

export default nextConfig;
