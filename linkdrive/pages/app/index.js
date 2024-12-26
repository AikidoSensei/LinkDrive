"use client"
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import link from '@/public/black-link.json'


const Lottie = dynamic(() => import('lottie-react'), { ssr: false })


const index = () => {
 const {data:session} = useSession()
 const router = useRouter()
useEffect(()=>{
 if(!session){
  router.push('/login')
 }
 else{setTimeout(
  ()=>router.push('/app/dashboard'), 5000)}
},[session])
  return (
		<div className='w-screen h-screen flex justify-center items-center text-black bg-white'>
			<Head>
				<title>LinkDrive App</title>
			</Head>

			<div className='w-full col-span-2 flex justify-center items-center h-screen z-[1000] text-black'>
				<div className='w-[100px] h-[100px] bg-black rounded-3xl flex items-center justify-center'>
					<div className=' bg-white rounded-full shadow-xl p-1 w-[50px]'>
						<Lottie animationData={link} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default index
