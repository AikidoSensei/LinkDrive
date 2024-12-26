'use client'

import {
	FileIcon,
	Folder,
	MoreVertical,
	PackageOpen,
	Star,
	Trash,
	Trash2,
} from 'lucide-react'
import React, { useContext } from 'react'
import moment from 'moment'
import ToolTip from '../ToolTip'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import DeleteModal from '../DeleteModal'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { RefreshContext } from '@/context/RefreshContext'
import { app } from '@/configuration/FirebaseConfig'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

const FileItem = ({ file, view }) => {
	const db = getFirestore(app)
  const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	// to check the file type and return appopriate icon :-)
	const iconChecker = (format) => {
		const type = format.toLowerCase()

		if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type)) {
			return <ImageIcon />
		} 
		else if (type === 'pdf') {
			return <PdfIcon />
		} 
		else if (['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'].includes(type)) {
			return <AudioIcon/>
		} 
		else if (['ppt', 'pptx',].includes(type)) {
			return <PptIcon/>
		} 
		else if (
			['docx', 'doc', 'txt', 'ppt', 'pptx', 'xlsx', 'csv'].includes(type)
		) {
			return <DocIcon />
		} else {
			return <FileIcon />
		}
	}
	// format file size function
	const formatFileSize = (bytes) => {
		if (bytes < 1000) {
			return `${bytes} Bytes`
		} else if (bytes < 1000 ** 2) {
			return `${(bytes / 1000).toFixed(2)} KB`
		} else if (bytes < 1000 ** 3) {
			return `${(bytes / 1000 ** 2).toFixed(2)} MB`
		} else {
			return `${(bytes / 1000 ** 3).toFixed(2)} GB`
		}
	}
	// handle starring
const handleStar = async (id, starred) => {
	try {
		const fileRef = doc(db, 'Files', id)

		const newStarredValue = !starred

		await updateDoc(fileRef, {
			starred: newStarredValue,
		})

		setRefreshTrigger(!refreshTrigger)

		toast({
			title: 'Success',
			description: `File has been ${newStarredValue ? 'starred' : 'unstarred'}`,
			variant: 'default',
		})
	} catch (error) {
		console.error('Error updating the starred status:', error)

		toast({
			title: 'Error',
			description: 'Could not update starred status',
			variant: 'destructive',
		})
	}
}
const handleTrash = async (id, trash) => {
	try {
		const fileRef = doc(db, 'Files', id)

		const newTrashValue = !trash

		await updateDoc(fileRef, {
			trash: newTrashValue,
		})

		setRefreshTrigger(!refreshTrigger)

		toast({
			title: 'Success',
			description: `File has been ${newTrashValue ? 'moved to trash' : 'removed from trash'}`,
			variant: 'default',
		})
	} catch (error) {
		console.error('Error updating the trash status:', error)

		toast({
			title: 'Error',
			description: 'Could not update trash status',
			variant: 'destructive',
		})
	}
}
	return (
		<div
			className={`w-full relative ${
				view === 'icons'
					? 'h-[130px] border-[1px] rounded-lg p-4 text-sm  hover:shadow-lg  '
					: 'grid grid-cols-5 items-center px-0 bg-white border-b-[1px] py-4 text-sm hover:bg-blue-300/10 '
			} text-black cursor-pointer  `}
		>
			{/* icon container with icon checker*/}
			<div
				className={`w-full ${
					view === 'icons'
						? 'flex flex-col  justify-between space-y-2  items-center h-full gap-2'
						: 'flex col-span-2 items-center gap-4 '
				}  `}
			>
				<div className={`${view === 'icons' ? 'w-10 h-10' : 'w-5 h-5'}`}>
					{iconChecker(file.type)}
				</div>
				<ToolTip
					item={
						<p
							className={`'text-center text-ellipsis ' ${
								view === 'icons'
									? 'text-xs text-center line-clamp-2 '
									: 'w-[100px] lg:w-[200px] text-xs lg:text-sm overflow-hidden line-clamp-1 z-10'
							}`}
							onClick={() => window.open(file.imageUrl)}d
						>
							{file.name}
						</p>
					}
					text={file.name}
				/>
			</div>

			{/* show the modified and size of files in list mode */}
			{view === 'list' && (
				<React.Fragment>
					<ToolTip
						item={
							<p className='text-[8pt] md:text-sm col-span-1 text-slate-700'>
								{moment(file.modifiedAt).format('LL')}
							</p>
						}
						text={moment(file.modifiedAt).format('LLLL')}
					/>
					<p className='text-[8pt] md:text-sm ml-12  col-span-1 text-slate-700'>
						{formatFileSize(file.size)}
					</p>
				</React.Fragment>
			)}
			{/* more options */}
			{file.starred && (
				<Star strokeWidth={1} size={10} fill='#FDD835' stroke='#FDD835' />
			)}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<a
						className={`flex justify-center items-center w-max p-2 rounded-full hover:bg-black/5 duration-200 ${
							view === 'list' ? 'absolute right-0' : 'absolute top-0 left-1'
						}`}
					>
						<ToolTip
							item={<MoreVertical size={15} strokeWidth={2} />}
							text={'more options'}
						/>
					</a>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					className='bg-white py-1 px-1 rounded-md w-[200px] shadow-md border border-slate-300 z-20'
					side='right'
					align='start'
				>
					<DropdownMenu.Item
						className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mb-1 hover:bg-blue-500/10 hover:text-blue-600 cursor-pointer '
						onClick={() => window.open(file.imageUrl)}
					>
						<PackageOpen strokeWidth={1} size={18} /> Open File
					</DropdownMenu.Item>
					<Separator />
					<DropdownMenu.Item
						className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md my-1 hover:bg-yellow-500/10 hover:text-yellow-600 cursor-pointer '
						onClick={() => handleStar(file.id, file.starred)}
					>
						<Star
							strokeWidth={1}
							size={18}
							fill={`${file.starred ? '#FDD835' : 'transparent'}`}
							stroke='#FDD835'
							className=''
						/>
						{file.starred ? 'Remove from starred' : 'Star'}
					</DropdownMenu.Item>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<div
								className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md  hover:bg-red-500/10 hover:text-red-600 cursor-pointer '
								onClick={(e) => {
									e.stopPropagation()
								}}
							>
								<Trash2 strokeWidth={1} size={18} color='red' /> Delete
							</div>
						</AlertDialogTrigger>
						<DeleteModal
							path={file.imageUrl}
							name={file.name}
							id={file.id}
							trash={() => handleTrash(file.id, file.trash)}
							trashState={file.trash}
							fileSize={file.size}
						/>
					</AlertDialog>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}

// ########### MY DROPDOWN COMPONENT ############

// ########### MY SVG ICONS COMPONENT ############
const ImageIcon = () => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'>
			<path
				d='M25.6 0H6.4C2.86538 0 0 2.86538 0 6.4V25.6C0 29.1346 2.86538 32 6.4 32H25.6C29.1346 32 32 29.1346 32 25.6V6.4C32 2.86538 29.1346 0 25.6 0Z'
				fill='url(#paint0_linear_103_1789)'
			/>
			<path
				d='M5.9577 24.8845C5.42578 25.9483 6.19937 27.2 7.38878 27.2H18.2111C19.4005 27.2 20.1741 25.9483 19.6422 24.8845L14.231 14.0622C13.6414 12.8829 11.9585 12.8829 11.3688 14.0622L5.9577 24.8845Z'
				fill='white'
			/>
			<path
				d='M15.5577 24.8845C15.0258 25.9483 15.7994 27.2 16.9888 27.2H24.6111C25.8005 27.2 26.5741 25.9483 26.0422 24.8845L22.231 17.2622C21.6414 16.0829 19.9585 16.0829 19.3688 17.2622L15.5577 24.8845Z'
				fill='white'
				fill-opacity='0.6'
			/>
			<path
				d='M24.0002 11.2C25.7675 11.2 27.2002 9.76726 27.2002 7.99995C27.2002 6.23264 25.7675 4.79995 24.0002 4.79995C22.2329 4.79995 20.8002 6.23264 20.8002 7.99995C20.8002 9.76726 22.2329 11.2 24.0002 11.2Z'
				fill='white'
			/>
			<defs>
				<linearGradient
					id='paint0_linear_103_1789'
					x1='16'
					y1='0'
					x2='16'
					y2='32'
					gradientUnits='userSpaceOnUse'
				>
					<stop stop-color='#00E676' />
					<stop offset='1' stop-color='#00C853' />
				</linearGradient>
			</defs>
		</svg>
	)
}
const PdfIcon = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			// xmlns:xlink='http://www.w3.org/1999/xlink'
			version='1.1'
			id='Layer_1'
			viewBox='0 0 309.267 309.267'
			// xml:space='preserve'
		>
			<g>
				<path
					style={{ fill: '#E2574C' }}
					d='M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658   c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z'
				/>
				<path
					style={{ fill: '#B53629' }}
					d='M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z'
				/>
				<path
					style={{ fill: '#FFFFFF' }}
					d='M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44   c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153   c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z    M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159   c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413   c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964   c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379   c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703   c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z'
				/>
			</g>
		</svg>
	)
}
const DocIcon = () => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 0 64 64'>
			<g fill-rule='evenodd'>
				<path
					d='m5.11 0a5.07 5.07 0 0 0 -5.11 5v53.88a5.07 5.07 0 0 0 5.11 5.12h45.78a5.07 5.07 0 0 0 5.11-5.12v-38.6l-18.94-20.28z'
					fill='#107cad'
				/>

				<path
					d='m56 20.35v1h-12.82s-6.31-1.26-6.13-6.71c0 0 .21 5.71 6 5.71z'
					style={{}}
					fill='#084968'
				/>

				<path
					d='m37.07 0v14.56a5.78 5.78 0 0 0 6.11 5.79h12.82z'
					fill='#90d0fe'
					opacity='.5'
				/>
			</g>

			<path
				d='m14.24 53.86h-3a1.08 1.08 0 0 1 -1.08-1.08v-9.85a1.08 1.08 0 0 1 1.08-1.08h3a6 6 0 1 1 0 12zm0-10.67h-2.61v9.34h2.61a4.41 4.41 0 0 0 4.61-4.66 4.38 4.38 0 0 0 -4.61-4.68zm14.42 10.89a5.86 5.86 0 0 1 -6-6.21 6 6 0 1 1 11.92 0 5.87 5.87 0 0 1 -5.92 6.21zm0-11.09c-2.7 0-4.41 2.07-4.41 4.88s1.71 4.88 4.41 4.88 4.41-2.09 4.41-4.88-1.72-4.87-4.41-4.87zm18.45.38a.75.75 0 0 1 .2.52.71.71 0 0 1 -.7.72.64.64 0 0 1 -.51-.24 4.06 4.06 0 0 0 -3-1.38 4.61 4.61 0 0 0 -4.63 4.88 4.63 4.63 0 0 0 4.63 4.88 4 4 0 0 0 3-1.37.7.7 0 0 1 .51-.24.72.72 0 0 1 .7.74.78.78 0 0 1 -.2.51 5.33 5.33 0 0 1 -4 1.69 6.22 6.22 0 0 1 0-12.43 5.26 5.26 0 0 1 4 1.72z'
				fill='#ffffff'
			/>
		</svg>
	)
}
const AudioIcon = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			x='0px'
			y='0px'
	
			viewBox='0 0 48 48'
		>
			<path
				fill='#ed3675'
				d='M20,24c-5.523,0-10,4.477-10,10s4.477,10,10,10s10-4.477,10-10S25.523,24,20,24z'
			></path>
			<linearGradient
				id='thMIbMD7~VnYoyixFJ5D6a_p6vT9rfwUGw6_gr1'
				x1='30'
				x2='41'
				y1='8'
				y2='8'
				gradientUnits='userSpaceOnUse'
			>
				<stop offset='0' stop-color='#bd1949'></stop>
				<stop offset='.108' stop-color='#c31a4b'></stop>
				<stop offset='.38' stop-color='#ca1b4d'></stop>
				<stop offset='1' stop-color='#cc1b4e'></stop>
			</linearGradient>
			<path
				fill='url(#thMIbMD7~VnYoyixFJ5D6a_p6vT9rfwUGw6_gr1)'
				d='M39,12h-9V4h9c1.105,0,2,0.895,2,2v4C41,11.105,40.105,12,39,12z'
			></path>
			<path fill='#ed3675' d='M30,4h-2c-2.209,0-4,1.791-4,4v26h6V4z'></path>
		</svg>
	)
}
const PptIcon = ()=>{
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			x='0px'
			y='0px'
			viewBox='0 0 48 48'
		>
			<path
				fill='#d35230'
				d='M8,24c0,9.941,8.059,18,18,18s18-8.059,18-18H26H8z'
			></path>
			<path fill='#ff8f6b' d='M26,6v18h18C44,14.059,35.941,6,26,6z'></path>
			<path fill='#ed6c47' d='M26,6C16.059,6,8,14.059,8,24h18V6z'></path>
			<path
				d='M26,16.681C26,14.648,24.352,13,22.319,13H11.774C9.417,16.044,8,19.852,8,24	c0,5.116,2.145,9.723,5.571,13h8.747C24.352,37,26,35.352,26,33.319V16.681z'
				opacity='.05'
			></path>
			<path
				d='M22.213,13.333H11.525C9.32,16.321,8,20.002,8,24c0,4.617,1.753,8.814,4.611,12h9.602	c1.724,0,3.121-1.397,3.121-3.121V16.454C25.333,14.731,23.936,13.333,22.213,13.333z'
				opacity='.07'
			></path>
			<path
				d='M22.106,13.667H11.276C9.218,16.593,8,20.151,8,24c0,4.148,1.417,7.956,3.774,11h10.332	c1.414,0,2.56-1.146,2.56-2.56V16.227C24.667,14.813,23.52,13.667,22.106,13.667z'
				opacity='.09'
			></path>
			<linearGradient
				id='N~uyq1CljjkKMh72IFt0Fa_ifP93G7BXUhU_gr1'
				x1='4.586'
				x2='22.77'
				y1='14.586'
				y2='32.77'
				gradientUnits='userSpaceOnUse'
			>
				<stop offset='0' stop-color='#ca4e2a'></stop>
				<stop offset='1' stop-color='#b63016'></stop>
			</linearGradient>
			<path
				fill='url(#N~uyq1CljjkKMh72IFt0Fa_ifP93G7BXUhU_gr1)'
				d='M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z'
			></path>
			<path
				fill='#fff'
				d='M14.673,19.012H10v10h2.024v-3.521H14.3c1.876,0,3.397-1.521,3.397-3.397v-0.058	C17.697,20.366,16.343,19.012,14.673,19.012z M15.57,22.358c0,0.859-0.697,1.556-1.556,1.556h-1.99v-3.325h1.99	c0.859,0,1.556,0.697,1.556,1.556V22.358z'
			></path>
		</svg>
	)
}
export {ImageIcon, PdfIcon, DocIcon, AudioIcon, PptIcon}
export default FileItem
