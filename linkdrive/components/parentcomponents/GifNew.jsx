import React from 'react'
import dynamic from 'next/dynamic'

const LottieComponent = dynamic(() => import('lottie-react'), { ssr: false })


import animationData from '../../public/newstuff.json'
const GifNew = ({text}) => {
  return (
		<div className='w-48 h-full flex flex-col'>
			<LottieComponent animationData={animationData} />
			<p className='text-sm text-center font-thin text-slate-600'>{text}</p>
		</div>
	)
}

export default GifNew
