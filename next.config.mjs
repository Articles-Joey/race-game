/** @type {import('next').NextConfig} */
const nextConfig = {
    // TODO - Disable this after production issue is resolved
    // productionBrowserSourceMaps: true,
    // compiler: {
    //     removeConsole: process.env.NODE_ENV === 'production',
    // },
    images: {
        // domains: ['cdn.articles.media', 'articles-website.s3.amazonaws.com', 'd3bzp9rk94ifwy.cloudfront.net'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.articles.media',
                port: '',
                // pathname: '',
            },
            {
                protocol: 'https',
                hostname: 'articles-website.s3.amazonaws.com',
                port: '',
                // pathname: '',
            },
        ],
    },
};

export default nextConfig;
