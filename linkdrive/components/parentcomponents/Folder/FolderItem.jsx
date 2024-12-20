"use client"
import { Folder, FolderOpen, LucideMoreVertical, MoreVertical, MoreVerticalIcon, Trash2 } from 'lucide-react'
import React from 'react'
import moment from 'moment'
import ToolTip from '../ToolTip'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import DeleteModal from '../DeleteModal'
import DeleteFolderModal from '../DeleteFolderModal'
const FolderItem = ({folder, view, icon}) => {
console.log(icon)
  return (
		<div
			className={`w-full relative ${
				view === 'icons'
					? 'h-[130px]  rounded-xl p-4 text-sm  hover:bg-black/5  '
					: 'grid grid-cols-4 items-center px-0 bg-white border-b-[1px] py-4 text-sm hover:bg-blue-300/10 '
			} text-black cursor-pointer  `}
		>
			<div
				className={`w-full ${
					view === 'icons'
						? 'flex flex-col justify-center items-center h-full gap-2'
						: 'flex col-span-2  items-center gap-4'
				}  `}
			>
				{icon?<FolderIcon size={view === 'icons' ? 50 : 20} />:
				<FolderIcon2 size={view === 'icons' ? 50 : 20} />}
				<p className='text-center'>{folder.name}</p>
			</div>
			{/* show the modified date */}
			{view === 'list' && (
				<React.Fragment>
					<ToolTip
						item={
							<p className='text-xs md:text-sm col-span-1 text-slate-700'>
								{moment(folder.modifiedAt).format('LL')}
							</p>
						}
						text={moment(folder.modifiedAt).format('LLLL')}
					/>
				</React.Fragment>
			)}
			{/* more options */}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<a
						className={`flex justify-center items-center w-max p-2 rounded-full hover:bg-black/5 duration-200 ${
							view === 'list' ? 'absolute right-0' : 'absolute top-0 left-1'
						}`}
					>
						<ToolTip
							item={<MoreVertical size={15} strokeWidth={1} />}
							text={'more options'}
						/>
					</a>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					className='bg-white py-1 px-1 rounded-md w-[200px] shadow-md border border-slate-300 z-20'
					side='right'
					align='start'
				>
					<DropdownMenu.Item className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mb-1 hover:bg-blue-500/10 hover:text-blue-600  cursor-pointer '>
						<FolderOpen strokeWidth={1} size={18} /> Open Folder
					</DropdownMenu.Item>
					<Separator />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<div
								className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mt-1 hover:bg-red-500/10 hover:text-red-600 '
								onClick={(e) => e.stopPropagation()}
							>
								<Trash2 strokeWidth={1} size={18} color='red' /> Delete
							</div>
						</AlertDialogTrigger>
						<DeleteFolderModal folderId={folder.id} path='' />
					</AlertDialog>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}
const FolderIcon = ({size})=>{
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			x='0px'
			y='0px'
			width={size}
			height={size}
			viewBox='0 0 48 48'
		>
			<path
				fill='#FFA000'
				d='M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z'
			></path>
			<path
				fill='#FFCA28'
				d='M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z'
			></path>
		</svg>
	)
}
const FolderIcon2 = ({size}) =>{
	return(
		<svg
			xmlns='http://www.w3.org/2000/svg'
			x='0px'
			y='0px'
			width={size}
			height={size}
			viewBox='0 0 72 72'
			color='blue'
		>
			<path d='M 19 13 C 14.037 13 10 17.038 10 22 L 10 49 C 10 49.217 10.017203 49.431531 10.033203 49.644531 L 15.496094 35.582031 C 17.286094 30.976031 21.636125 28 26.578125 28 L 59.988281 28 C 60.673281 28 61.343 28.086703 62 28.220703 L 62 26 C 62 21.038 57.963 17 53 17 L 32.753906 17 C 32.526906 17 32.307813 16.923203 32.132812 16.783203 L 29.869141 14.974609 C 28.280141 13.701609 26.283094 13 24.246094 13 L 19 13 z M 26.578125 32 C 23.299125 32 20.412609 33.97525 19.224609 37.03125 L 12.263672 54.947266 C 13.914672 56.814266 16.318 58 19 58 L 53.1875 58 C 56.5105 58 59.437531 55.998438 60.644531 52.898438 L 65.591797 40.173828 C 66.308797 38.326828 66.070172 36.247328 64.951172 34.611328 C 64.770172 34.346328 62.886281 32 59.988281 32 L 26.578125 32 z'></path>
		</svg>
	)
}
export default FolderItem
