'use client'
import React, { useContext, useEffect, useState } from 'react'
import {
	MoveLeft,
	MoveRight,
	Cloud,
	CloudOff,
	Search,
	PanelRight,
	FileIcon,
	Folder,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import ToolTip from './ToolTip'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
} from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { useSession } from 'next-auth/react'
import { RefreshContext } from '@/context/RefreshContext'
import {
	ImageIcon,
	PdfIcon,
	DocIcon,
	AudioIcon,
	PptIcon,
} from './File/FileItem'
const SearchBar = (props) => {
	const { crumb } = useContext(BreadCrumbContext)
	const { parentFolderId, setParentFolderId } = useContext(ParentFolderContext)
	const { refreshTrigger } = useContext(RefreshContext)
	const router = useRouter()
	const { data: session } = useSession()
	// console.log('searchbar component rendered @ ')

	// ################################### USESTATE   #######################
	const [searchquery, setsearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [results, setResult] = useState([])
	const [showResults, setShowResults] = useState(false)
	const [networkState, setNetworkState] = useState({
		isOnline: true,
		effectiveType: '',
		downlink: 0,
		rtt: 0,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	//

	// ################################### USESTATE   #######################

	useEffect(() => {
		const updateNetState = () => {
			const connection =
				navigator.connection ||
				navigator.mozConnection ||
				navigator.webkitConnection
			setNetworkState({
				isOnline: navigator.onLine,
				effectiveType: connection?.effectiveType || 'unknown',
				downlink: connection?.downlink || 0,
				rtt: connection?.rtt || 0,
			})
		}

		window.addEventListener('online', updateNetState)
		window.addEventListener('offline', updateNetState)

		return () => {
			window.removeEventListener('online', updateNetState)
			window.removeEventListener('offline', updateNetState)
		}
	}, [])

	useEffect(() => {
		getAllFolders()
		getAllFiles()
	}, [session, refreshTrigger])

	//my icon checker
	const iconChecker = (format, size) => {
		const type = format ? format.toLowerCase() : ''

		if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type)) {
			return <ImageIcon />
		} else if (!format && !size) {
			return <Folder size={14} />
		} else if (type === 'pdf') {
			return <PdfIcon />
		} else if (['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'].includes(type)) {
			return <AudioIcon />
		} else if (['ppt', 'pptx'].includes(type)) {
			return <PptIcon />
		} else if (
			['docx', 'doc', 'txt', 'ppt', 'pptx', 'xlsx', 'csv'].includes(type)
		) {
			return <DocIcon />
		} else {
			return <FileIcon size={14} />
		}
	}

	// get all folders function
	const getAllFolders = async () => {
		try {
			setLoading(true)
			const db = getFirestore(app)
			const q = query(
				collection(db, 'Folders'),
				where('createdBy', '==', session.user.email)
			)

			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				setSearchResults([])
				setLoading(false)
				return
			}

			const folders = []
			querySnapshot.forEach((doc) => {
				folders.push(doc.data())
			})
			setSearchResults(folders)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	// get all files function
	const getAllFiles = async () => {
		try {
			setLoading(true)
			const db = getFirestore(app)
			const q = query(
				collection(db, 'Files'),
				where('createdBy', '==', session.user.email)
			)

			const querySnapshot = await getDocs(q)
			if (querySnapshot.empty) {
				setLoading(false)
				return
			}

			const files = []
			querySnapshot.forEach((doc) => {
				files.push(doc.data())
			})

			setSearchResults((prevResults) => [...prevResults, ...files])
			setLoading(false)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = (e) => {
		const value = e.target.value
		setsearchQuery(value)
		if (value.trim()) {
			setShowResults(true)

			// Mock search results (replace with actual API call)

			const filtered = searchResults.filter((item) =>
				item.name.toLowerCase().includes(value.toLowerCase())
			)
			setResult(filtered)
		} else {
			setShowResults(false)
		}
	}
	const folderClick = (item) => {
		
		if (item.size) {
	window.open(item.imageUrl)
	setsearchQuery('')
	setShowResults(false)
		} else {
			setParentFolderId(item.id)
			router.push({
				pathname: `/app/dashboard/folder/${item.id}`,
				query: {
					id: item.id,
					name: item.name,
				},
			})
setsearchQuery('')
setShowResults(false)
		}
	}
	useEffect(() => {
		const handleClick = () => {
			setsearchQuery('')
		setShowResults(false)
		}

		window.document.addEventListener('click', handleClick)

		return () => {
			window.document.removeEventListener('click', handleClick)
		}
	}, [])
	return (
		<div className='w-full h-14 flex items-center justify-between gap-2 bg-white px-2 py-4 border-b'>
			{/* Left Section */}
			<div className='flex items-center gap-2'>
				<SidebarTrigger className='-ml-1 text-black' />
				<Separator orientation='vertical' className='mr-2 h-4' />

				<div className='flex items-center text-slate-700 gap-1 md:gap-2'>
					<ToolTip
						item={
							<MoveLeft
								className='cursor-pointer'
								strokeWidth={1}
								onClick={() => router.back()}
							/>
						}
						text={'Go back'}
					/>
					<ToolTip
						item={
							<MoveRight
								className='cursor-pointer'
								strokeWidth={1}
								onClick={() => router.forward()}
							/>
						}
						text={'Forward'}
					/>
				</div>
				<Breadcrumb className='hidden md:flex'>
					<BreadcrumbList>
						<BreadcrumbItem className='hidden md:block text-xs text-ellipsis line-clamp-1'>
							<BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className='hidden md:block' />
						<BreadcrumbItem className='hidden md:block text-xs'>
							<BreadcrumbPage>{crumb}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Search Section */}
			<div className='relative flex-grow'>
				<div
					className={`flex items-center h-8 bg-gray-100 rounded-lg px-3 gap-2 border ${
						showResults ? 'border-blue-400' : 'border-gray-300'
					}`}
				>
					<Search color='black' size={16} />
					<input
						type='text'
						value={searchquery}
						onChange={handleSearch}
						onClick={(e)=>{
							e.stopPropagation()
							handleSearch
						}
							}
						placeholder='Search'
						className='w-full bg-transparent outline-none text-sm text-black'
					/>
				</div>

				{/* Search Results */}
				{showResults && (
					<div className='absolute top-10 left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg z-20 max-h-60 overflow-y-auto'>
						{results.length > 0 ? (
							results?.map((result) => (
								<div
									key={result.id}
									className='flex items-center  px-4 py-2 hover:bg-gray-100 cursor-pointer  text-black'
									onClick={(e) => {
										e.stopPropagation()
										folderClick(result)
									}}
								>
									<div className='flex gap-3'>
										<div className='w-4 h-4'>
											{iconChecker(result.type, result.size)}
										</div>
										<p className='text-xs line-clamp-1 text-ellipsis'>
											{result.name}
										</p>
									</div>
								</div>
							))
						) : (
							<div className='p-4 text-sm text-gray-500'>No files found</div>
						)}
					</div>
				)}
			</div>

			{/* Network State */}
			<div className='flex items-center gap-2'>
				{networkState.isOnline ? (
					<ToolTip
						item={
							<span className='text-xs flex items-center gap-1 text-slate-700'>
								<Cloud size={13} color='limegreen' /> Online
							</span>
						}
						text={'Good network connection'}
					/>
				) : (
					<ToolTip
						item={
							<span className='text-xs flex gap-1 text-slate-700'>
								<CloudOff size={13} color='red' /> Offline
							</span>
						}
						text={'No network connection'}
					/>
				)}
				<div
					className='p-2 hover:bg-black/5 cursor-pointer rounded-md text-black'
					onClick={() => props.storage()}
				>
					<PanelRight size={16} />
				</div>
			</div>
		</div>
	)
}

export default SearchBar
