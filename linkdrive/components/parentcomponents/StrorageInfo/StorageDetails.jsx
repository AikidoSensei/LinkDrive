'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { AudioLines, File, Image, List, Video } from 'lucide-react'
import React from 'react'

const StorageDetails = ({ used, eachSize, files, loading }) => {
	const { documents, images, audio, others } = files
	const percentageConverter = (bytes, denominator) => {
		return (bytes / denominator) * 100 ;
	}
	let DOCUMENT_PERCENTAGE = Math.round(percentageConverter(eachSize.documents, 50000000))
	let IMAGE_PERCENTAGE = Math.round(percentageConverter(eachSize.images, 5000000))
	let AUDIO_PERCENTAGE = Math.round(percentageConverter(eachSize.audio, 50000000))
	let OTHERS_PERCENTAGE = Math.round(percentageConverter(eachSize.others, 50000000))

  const XDOCUMENT_PERCENTAGE = (DOCUMENT_PERCENTAGE * 0.2).toString()+'%'
  const XIMAGE_PERCENTAGE = (IMAGE_PERCENTAGE * 0.2).toString() + '%'
  const XAUDIO_PERCENTAGE = (AUDIO_PERCENTAGE * 0.2).toString() + '%'
  const XOTHERS_PERCENTAGE = (OTHERS_PERCENTAGE * 0.2).toString() + '%'
  
  DOCUMENT_PERCENTAGE = DOCUMENT_PERCENTAGE.toString()+'%';
  IMAGE_PERCENTAGE = IMAGE_PERCENTAGE.toString()+'%';
  AUDIO_PERCENTAGE = AUDIO_PERCENTAGE.toString()+'%';
  OTHERS_PERCENTAGE = OTHERS_PERCENTAGE.toString()+'%';
  
  
  
  console.log(XDOCUMENT_PERCENTAGE, XIMAGE_PERCENTAGE, XAUDIO_PERCENTAGE, XOTHERS_PERCENTAGE)
  
	const formatFileSize = (bytes) => {
		if (bytes < 1024) {
			return `${bytes} Bytes`
		} else if (bytes < 1024 ** 2) {
			return `${(bytes / 1024).toFixed(2)} KB`
		} else if (bytes < 1024 ** 3) {
			return `${(bytes / 1024 ** 2).toFixed(2)} MB`
		} else {
			return `${(bytes / 1024 ** 3).toFixed(2)} GB`
		}
	}

	// code to format the sizes to appopriate mb gb kb
	const formatedUsed = formatFileSize(used)
	const docSize = formatFileSize(eachSize.documents)
	const imageSize = formatFileSize(eachSize.images)
	const audioSize = formatFileSize(eachSize.audio)
	const otherSize = formatFileSize(eachSize.others)

	return (
		<React.Fragment>
		  {loading ? <Loading/>:<div className='w-full  text-black p-4'>
  			<div className='flex flex-col w-full h-ful gap-y-2 rounded-xl p-2'>
  				{/* meter */}
  				<h1 className='text-xl lg:text-3xl font-extrabold'>
  					{formatedUsed} <span className='text-sm font-normal'>used of </span>
  					50MB
  				</h1>
  				<div className='w-full h-2.5 bg-black/5 rounded-full overflow-hidden flex'>
  					<div className='h-full rounded-e-full  bg-violet-600 z-[4]' style={{width:XDOCUMENT_PERCENTAGE}}></div>
  					<div className='h-full bg-green-600 -ml-1 rounded-e-full z-[3]' style={{width:XIMAGE_PERCENTAGE}}></div>
  					<div className='h-full bg-yellow-400 rounded-e-full -ml-1 z-[2]' style={{width:XAUDIO_PERCENTAGE}}></div>
  					<div className='h-full bg-gray-400 rounded-e-full -ml-1 z-[1]' style={{width:XOTHERS_PERCENTAGE}}></div>
  				</div>
  				<div className='w-full flex items-center justify-between text-xs'>
  					<div className='w-1/3 flex items-center gap-2'>
  						<div className='w-2 h-2 rounded-full bg-violet-600 '></div>
  						<span>Documents</span>
  					</div>
  					<div className='w-1/3 flex items-center gap-2'>
  						<div className='w-2 h-2 rounded-full bg-green-600 '></div>
  						<span>Photos</span>
  					</div>
  					<div className='w-1/3 flex items-center gap-2'>
  						<div className='w-2 h-2 rounded-full bg-yellow-400 '></div>
  						<span>Audio</span>
  					</div>
  					<div className='w-1/3 flex items-center gap-2'>
  						<div className='w-2 h-2 rounded-full bg-gray-400 '></div>
  						<span>Others</span>
  					</div>
  				</div>
  			</div>
  			{/* type of file details */}
  			<div className='w-full h-full flex flex-col gap-2 mt-4'>
  				<Documents size={docSize} length={documents} width={XDOCUMENT_PERCENTAGE } />
  				<Images size={imageSize} length={images} width={XIMAGE_PERCENTAGE}/>
  				<Audio size={audioSize} length={audio} width={XAUDIO_PERCENTAGE} />
  				<Others size={otherSize} length={others} width={XOTHERS_PERCENTAGE} />
  			</div>
  		</div>}
		</React.Fragment>
	)
}
const Documents = ({ size, length, width }) => {
	return (
		<div className='w-full bg-violet-300/10 p-2 rounded-xl border border-slate-2'>
			<div className='flex items-center w-full justify-between '>
				{/* icon */}
				<div className='flex gap-2'>
					<div className='w-10 h-10 bg-slate-600/10 rounded-xl flex items-center justify-center'>
						<List strokeWidth={1} size={15} />
					</div>
					{/* info */}
					<div className='flex flex-col '>
						<p className='text-sm font-bold'>Document</p>
						<p className='text-xs'>{length} Files</p>
					</div>
				</div>
				<h1 className='text-sm md:text-md  font-extrabold '>{size}</h1>
			</div>
			<div className='w-full h-1 flex bg-black/5 rounded-full overflow-hidden mt-4'>
				<div
					className={` h-full bg-violet-600 rounded-full`}
					style={{ width: width}}
				></div>
			</div>
		</div>
	)
}

const Images = ({ size, length, width }) => {
	return (
		<div className='w-full bg-green-300/10 p-2 rounded-xl border border-slate-2'>
			<div className='flex items-center w-full justify-between '>
				{/* icon */}
				<div className='flex gap-2'>
					<div className='w-10 h-10 bg-slate-600/10 rounded-xl flex items-center justify-center'>
						<Image strokeWidth={1} size={15} />
					</div>
					{/* info */}
					<div className='flex flex-col '>
						<p className='text-sm font-bold'>Images</p>
						<p className='text-xs'>{length} Files</p>
					</div>
				</div>
				<h1 className='text-sm md:text-md  font-extrabold '>{size}</h1>
			</div>
			<div className='w-full h-1 flex bg-black/5 rounded-full overflow-hidden mt-4'>
				<div
					className={` h-full bg-green-600 rounded-full`}
					style={{ width: width }}
				></div>
			</div>
		</div>
	)
}
const Audio = ({ size, length, width }) => {
	return (
		<div className='w-full bg-yellow-300/10 p-2 rounded-xl border border-slate-2'>
			<div className='flex items-center w-full justify-between '>
				{/* icon */}
				<div className='flex gap-2'>
					<div className='w-10 h-10 bg-slate-600/10 rounded-xl flex items-center justify-center'>
						<AudioLines strokeWidth={1} size={15} />
					</div>
					{/* info */}
					<div className='flex flex-col '>
						<p className='text-sm font-bold'>Audio</p>
						<p className='text-xs'>{length} Files</p>
					</div>
				</div>
				<h1 className='text-sm md:text-md  font-extrabold '>{size}</h1>
			</div>
			<div className='w-full h-1 flex bg-black/5 rounded-full overflow-hidden mt-4'>
				<div
					className={` h-full bg-yellow-400 rounded-full`}
					style={{ width: width }}
				></div>
			</div>
		</div>
	)
}
const Others = ({ size, length, width }) => {
	return (
		<div className='w-full bg-gray-300/10 p-2 rounded-xl border border-slate-2'>
			<div className='flex items-center w-full justify-between '>
				{/* icon */}
				<div className='flex gap-2'>
					<div className='w-10 h-10 bg-slate-600/10 rounded-xl flex items-center justify-center'>
						<File strokeWidth={1} size={15} />
					</div>
					{/* info */}
					<div className='flex flex-col '>
						<p className='text-sm font-bold'>Others</p>
						<p className='text-xs'>{length} Files</p>
					</div>
				</div>
				<h1 className='text-sm md:text-md  font-extrabold '>{size}</h1>
			</div>
			<div className='w-full h-1 flex bg-black/5 rounded-full overflow-hidden mt-4'>
				<div
					className={` h-full bg-gray-600 rounded-full`}
					style={{ width: width }}
				></div>
			</div>
		</div>
	)
}
const Loading = ()=>{
  return (
    <div className='w-full h-full flex flex-col p-4 gap-2'>
      <Skeleton className='h-20 w-full p-2'/>
      <Skeleton className='h-2 w-full p-2 rounded-full'/>
      <div className='w-full flex justify-between items-center gap-2'>
        <Skeleton className='h-10 w-full'/>
        <Skeleton className='h-10 w-full'/>
        <Skeleton className='h-10 w-full'/>
        <Skeleton className='h-10 w-full'/>
      </div>
      <Skeleton className='h-20 w-full p-2'/>
      <Skeleton className='h-20 w-full p-2'/>
      <Skeleton className='h-20 w-full p-2'/>
      <Skeleton className='h-20 w-full p-2'/>
    </div>
  )
}
export default StorageDetails
