"use client"
import React, { useEffect } from 'react'
import { useState } from 'react'
import ToolTip from '../ToolTip'
import { LayoutGrid, List } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import FileItem from './FileItem'
import { Skeleton } from '@/components/ui/skeleton'
import DetailBar from '../DetailBar'
import GifNew from '../GifNew'

const FileList = ({data, loading, error, success, config}) => {
	const [filteredFolders, setFilteredFolders] = useState([])
	
	const [view, setView] = useState('icons')
	const [all, setAll] = useState(true)
	useEffect(() => {
	const filter = data.filter((folder) => folder.trash === false)
setFilteredFolders(filter)
	if (config?.view === true) {
		setView('icons')
	} else {
		setView('list')
	}
}, [config, data ])
  return (
		<div className='p-2 lg:p-5  bg-white border-t flex flex-col gap-0 min-h-[320px] h-max'>
			<div className='flex justify-between items-center'>
				<p className='text-xs lg:text-xl font-normal lg:font-bold text-black'>
					{'Recent Files'}
				</p>
				<div className='flex items-center gap-4 text-black'>
					<div
						className={` p-1 lg:p-2 rounded-full hover:bg-green-500/20 hover:text-black ${
							view === 'list' ? 'bg-green-500/20' : 'bg-white'
						}`}
						onClick={() => setView('list')}
					>
						<ToolTip
							text={'List layout'}
							item={
								<List className='w-4 h-4 lg:w-full' strokeWidth={1} size={13} />
							}
							// trigger={}
							view={view}
						/>
					</div>
					<div
						className={`p-1 lg:p-2 rounded-full hover:bg-green-500/20 hover:text-black ${
							view === 'icons' ? 'bg-green-500/20 ' : 'bg-white'
						} `}
						onClick={() => setView('icons')}
					>
						<ToolTip
							text={'Grid layout'}
							item={
								<LayoutGrid
									className='w-4 h-4 lg:w-full lg:h-full'
									strokeWidth={1}
									size={13}
								/>
							}
							// trigger={}
							view={view}
						/>
					</div>
					<a
						className='float-right bg-green-500 p-1 lg:p-2 rounded-md  text-white text-xs w-16 cursor-pointer flex justify-center itemc'
						onClick={() => setAll(!all)}
					>
						{all ? 'View All' : 'Recent'}
					</a>
				</div>
			</div>
			{view === 'list' && <DetailBar state={'file'} />}
			<Separator className={`'mt-0' ${view === 'icons' && 'mt-6'} `} />
			{loading && <Loading2 />}
			{error && <Error error={error} />}
			{success && (
				<div
					className={`${
						view === 'icons'
							? `${
									filteredFolders.length === 0
										? 'flex justify-center items-center w-full h-full '
										: 'w-full grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-2 '
							  } `
							: 'flex flex-col w-full h-full '
					} `}
				>
					{!loading && filteredFolders.length === 0 ? (
						<div className='w-full h-full flex justify-center items-center'>
							<GifNew text='Use the "New File" button to add new files' />
						</div>
					) : (
						<React.Fragment>
							{filteredFolders.map((item, index) => {
								return (
									<div>
										<FileItem key={index} file={item} view={view} />
									</div>
								)
							})}
						</React.Fragment>
					)}
				</div>
			)}
		</div>
	)
}
const loadarray = [1, 2, 3, 4]
export const Loading2 = () => {
	return (
		<div className='w-full h-10'>
			{loadarray.map((each,index) => (
				<div className='w-full h-full mt-2 flex ' key={index}>
					<div className=' w-full flex items-center gap-x-2'>
						<Skeleton className='h-full w-10  rounded-md' />
						<Skeleton className='w-full h-full ' />
					</div>
				</div>
			))}
		</div>
	)
}
const Error = ({ error }) => {
	return (
		<div className='w-full text-2xl text-black h-full flex items-center justify-center'>
			<h1>{error&&'error'} x</h1>
		</div>
	)
}
export default FileList
