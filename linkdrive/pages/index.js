'use client'
import { motion } from 'framer-motion'
import { Geist, Geist_Mono } from 'next/font/google'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import link2 from '@/public/link2.json'
import { Button } from '@/components/ui/button'
import { Instagram, Linkedin } from 'lucide-react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})
const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
}

const squareVariants = {
	hidden: { opacity: 0, y: 100 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 1, type: 'spring' },
	},
}

export default function MyHome() {
	const { data: session } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (session) {
			router.push('app/')
		}
	}, [session])

	return (
		<div className='w-full h-full flex flex-col text-black justify-center items-center bg-custom-pattern bg-cover bg-center p-0 overflow-y-hidden'>
			<div className='w-full h-screen flex justify-center items-center bg-black/90 flex-col text-white p-6 gap-12'>
				<h1 className='text-3xl md:text-6xl font-extrabold text-center leading-tight'>
					Your All-in-One Storage Platform
				</h1>
				<h2 className='text-3xl md:text-[50pt] font-bold flex items-center gap-4'>
					<div className='bg-white rounded-full shadow-xl w-max '>
						<Lottie
							animationData={link2}
							autoplay={true}
							loop={false}
							className='w-30 h-30 w-[60px] md:w-[150px] '
						/>
					</div>
					link <span className='text-green-400 -ml-4'>drive</span>
				</h2>
				<p className='text-lg text-center text-white/80 max-w-xl mx-auto'>
					Share, organize, and access your files seamlessly from anywhere,
					anytime. Start now and experience effortless storage management.
				</p>
				<Button
					className='bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold shadow-xl hover:bg-green-400 hover:text-white transition duration-300 ease-in-out'
					onClick={() => signIn()}
				>
					Sign in with Google
				</Button>
			</div>

			<div className='min-h-screen h-full w-full bg-black/95 flex flex-col'>
				<motion.div
					className='h-full w-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[200px] gap-4'
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					// viewport={{ once: true, threshold: 0.5 }}
				>
					{/* Square 1 */}
					<motion.div
						className='w-full h-[300px] border border-white/40 rounded-xl bg-[radial-gradient(94%_98%_at_100%_100%,_#0b4abf_-90%,_rgb(0,3,15)_100%)] p-4'
						variants={squareVariants}
					>
						{' '}
						<h1 className='text-lg md:text-2xl font-bold text-white'>
							Secure File Sharing
						</h1>
						<p className='text-white/50 text-[12pt] lg:text-sm'>
							Your files are encrypted and stored safely, ensuring only
							authorized access. Advanced security measures protect your data
							from unauthorized access, breaches, or loss.
						</p>
					</motion.div>

					{/* Square 2 */}
					<motion.div
						className='w-full h-[300px] border border-white/40 rounded-xl bg-[radial-gradient(94%_98%_at_100%_100%,_#0b7f3f_-90%,_rgb(0,3,15)_100%)] p-4'
						variants={squareVariants}
					>
						{' '}
						<h1 className='text-lg md:text-2xl font-bold text-white'>
							Cross-Device Access
						</h1>
						<p className='text-white/50 text-[12pt] lg:text-sm'>
							Access your files seamlessly across all your devices—desktop,
							mobile, or tablet. Your data stays synced, allowing you to pick up
							where you left off, no matter the device.
						</p>
					</motion.div>

					{/* Square 3 */}
					<motion.div
						className='w-full h-[300px] border border-white/40 rounded-xl bg-[radial-gradient(94%_98%_at_100%_100%,_#bf0b0b_-90%,_rgb(15,0,0)_100%)] p-4'
						variants={squareVariants}
					>
			
						<h1 className='text-lg md:text-2xl font-bold text-white'>
							Fast Uploads
						</h1>
						<p className='text-white/50 text-[12pt] lg:text-sm'>
							Enjoy high-speed uploads that save time, even for large files.
							Optimized servers ensure smooth and efficient file transfers, even
							during peak usage times.
						</p>
					</motion.div>
				</motion.div>
				<div className='h-screen w-full bg-black/90 flex flex-col justify-center items-center text-white p-8'>
					<h1 className='text-3xl md:text-5xl font-bold mb-8 text-center'>
						How It Works
					</h1>
					<motion.div
						className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl'
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
					>
						{/* Step 1 */}
						<motion.div
							className='p-6 bg-gradient-to-br from-green-500 to-green-800 rounded-xl shadow-lg flex flex-col items-center'
							variants={squareVariants}
						>
							<div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4'>
								<span className='text-2xl font-bold text-black'>1</span>
							</div>
							<h2 className='text-xl font-semibold mb-2'>Sign Up</h2>
							<p className='text-center text-sm'>
								Create an account with your email or Google to get started.
							</p>
						</motion.div>
						{/* Step 2 */}
						<motion.div
							className='p-6 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl shadow-lg flex flex-col items-center'
							variants={squareVariants}
						>
							<div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4'>
								<span className='text-2xl font-bold text-black'>2</span>
							</div>
							<h2 className='text-xl font-semibold mb-2'>Upload Files</h2>
							<p className='text-center text-sm'>
								Upload and organize your files securely with a few clicks.
							</p>
						</motion.div>
						{/* Step 3 */}
						<motion.div
							className='p-6 bg-gradient-to-br from-red-500 to-red-800 rounded-xl shadow-lg flex flex-col items-center'
							variants={squareVariants}
						>
							<div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4'>
								<span className='text-2xl font-bold text-black'>3</span>
							</div>
							<h2 className='text-xl font-semibold mb-2'>Share & Access</h2>
							<p className='text-center text-sm'>
								Share files with others and access your storage across devices.
							</p>
						</motion.div>
					</motion.div>
				</div>
				<footer className='w-full bg-black/95 text-white py-8'>
					<div className='container mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
						{/* Branding */}
						<div className='text-center md:text-left'>
							<h1 className='text-2xl font-bold'>
								Link<span className='text-green-400'>Drive</span>
							</h1>
							<p className='text-sm mt-2 text-white/70'>
								Your reliable file storage and sharing platform.
							</p>
						</div>
						{/* Links */}
						<div className='flex gap-6'>
							<a
								href='#'
								className='text-sm text-white/80 hover:text-green-400'
							>
								Privacy Policy
							</a>
							<a
								href='#'
								className='text-sm text-white/80 hover:text-green-400'
							>
								Terms of Service
							</a>
							<a
								href='#'
								className='text-sm text-white/80 hover:text-green-400'
							>
								Support
							</a>
						</div>
						{/* Socials */}
						<div className='flex gap-4'>
							<a
								href='https://www.linkedin.com/in/abbas-suberu-842394285/'
								className='w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-400'
							>
								<Linkedin />
							</a>
						</div>
					</div>
					<p className='text-center mt-6 text-sm text-white/70'>
						&copy; {new Date().getFullYear()} LinkDrive. All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	)
}

