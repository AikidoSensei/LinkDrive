/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	// 'https://lh3.googleusercontent.com'
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
      }
		],
	},
}


export default nextConfig;
