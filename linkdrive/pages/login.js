'use client'
import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import link2 from '@/public/link2.json'
import Head from 'next/head'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const login = () => {
	const { data: session } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (session) {
			router.push('/')
		}
	}, [session])

	return (
		<div className='w-full h-screen bg-black/90 flex justify-center items-center'>
			<Head>
				<title>Login</title>
			</Head>

			<motion.div
				className='bg-white p-10 rounded-xl shadow-xl flex flex-col items-center w-80 sm:w-96'
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
			>
				<a href='/'>
					<Lottie
						animationData={link2}
						autoplay={true}
						loop={false}
						className=' w-[60px] md:w-[150px] '
					/>
				</a>
				<h1 className='text-2xl font-bold text-center mb-6 text-black'>
					Welcome Back to <a href='/'><span className='text-green-400'>LinkDrive</span></a>
				</h1>
				<p className='text-sm text-center text-black/60 mb-6'>
					Please sign in to continue to your all-in-one storage platform.
				</p>
				<Button
					className='bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-xl hover:bg-green-400 transition duration-300 ease-in-out w-full'
					onClick={() => signIn('google',{callbackUrl:'/app/dashboard'})}
				>
					Sign in with Google
				</Button>
			</motion.div>
		</div>
	)
}

export default login
