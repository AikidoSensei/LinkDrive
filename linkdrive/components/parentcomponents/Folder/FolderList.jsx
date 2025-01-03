"use client"
import React, { useContext, useEffect, useState } from 'react'
import FolderItem from './FolderItem'
import { Separator } from '@/components/ui/separator'
import ToolTip from '../ToolTip'
import { LayoutGrid, List } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/router'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import GifNew from '../GifNew'
import DetailBar from '../DetailBar'
import { Loading2 } from '../File/FileList'

const FolderList = ({ data, success, loading, error, title, config }) => {
	const router = useRouter()
  const [view, setView] = useState('icons')
		const [all, setAll] = useState(true)
	 useEffect(() => {
			if (config?.view === true) {
				setView('icons') 
			} else {
				setView('list')
			}
		}, [config])
		
		const {parentFolderId, setParentFolderId} = useContext(ParentFolderContext)

const folderClick = (item)=>{
	setParentFolderId(item.id)
	router.push({pathname:`/app/dashboard/folder/${item.id}`,query:{
		id:item.id,
		name:item.name
	}})
}
	return (
		<div className='p-2 lg:p-5 bg-white flex flex-col gap-0 min-h-[320px] h-max overflow-y-hidden '>
			<div className='flex justify-between items-center'>
				<p className='text-xs lg:text-xl font-normal lg:font-bold text-black'>
					{title || 'Recent Folders'}
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
								<List
									className='w-4 h-4 lg:w-full lg:h-full'
									strokeWidth={1}
									size={13}
								/>
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
						className='float-right bg-green-500 p-1 lg:p-2 rounded-md  text-white text-xs w-16 cursor-pointer flex justify-center items-center'
						onClick={() => setAll(!all)}
					>
						{all ? 'View All' : 'Recent'}
					</a>
				</div>
			</div>
			{view === 'list' && <DetailBar state={'folder'} />}
			<Separator className='mt-1 lg:mt-2' />
			{loading && <Loading2 />}
			{error && <Error />}
			{success && (
				<div
					className={`${
						view === 'icons'
							? `${
									data.length === 0
										? 'flex justify-center items-center w-full h-full '
										: 'w-full grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-2 '
							  } `
							: 'flex flex-col w-full h-full '
					} `}
				>
					{!loading && data.length === 0 ? (
						<div className=' w-full h-full flex justify-center items-center'>
							<GifNew text='Use the "New Folder" button to add new folders' />
						</div>
					) : (
						<React.Fragment>
							{data.map((item, index) => {
								return (
									<div
										key={index}
										onClick={() => {
											folderClick(item)
										}}
									>
										<FolderItem
											folder={item}
											view={view}
											icon={config?.defaultFolder}
										/>
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


const Error = () => {
	return (
		<div className='w-full text-2xl bg-green-400 text-black h-full flex items-center justify-center'>
			<h1>Something went wrong</h1>
		</div>
	)
}
export default FolderList
