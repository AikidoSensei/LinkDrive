'use client'
import React, { useState, useEffect, useContext } from 'react'
import { getFirestore, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'

import { LayoutGrid, List, Loader2, RotateCcw, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import ToolTip from '@/components/parentcomponents/ToolTip'
import DetailBar from '@/components/parentcomponents/DetailBar'
import GifNew from '@/components/parentcomponents/GifNew'
import FileItem from '@/components/parentcomponents/File/FileItem'
import { RefreshContext } from '@/context/RefreshContext'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

const Trash = () => {
	const db = getFirestore(app)
	const { data: session } = useSession()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	const [view, setView] = useState('list')

	useEffect(() => {
		const fetchTrashFiles = async () => {
			setLoading(true)
			setError(false)
			setSuccess(false)

			try {
				const querySnapshot = await getDocs(collection(db, 'Files'))
				const trashFiles = []

				querySnapshot.forEach((doc) => {
					const file = doc.data()
					if (file.trash === true) {
						trashFiles.push({ id: doc.id, ...file })
					}
				})

				setData(trashFiles)
				setSuccess(true)
			} catch (err) {
				console.error('Error fetching trashed files:', err)
				setError(true)
			} finally {
				setLoading(false)
			}
		}

		fetchTrashFiles()
	}, [session, refreshTrigger])

const handleClearTrash = async () => {
	try {
		toast({
			title: 'Deleting Files',
			description: 'Please wait while trash files are being deleted...',
			variant: 'message',
			action: (
				<ToastAction altText='deleting' className='outline-none border-none'>
					<Loader2 className='animate-spin' />
				</ToastAction>
			),
		})

		const trashFilesQuery = query(
			collection(db, 'Files'),
			where('trash', '==', true),
			where('createdBy', '==', session.user.email)
		)

		const querySnapshot = await getDocs(trashFilesQuery)

		if (querySnapshot.empty) {
			toast({
				title: 'No Trash Files',
				description: 'There are no files in the trash to delete.',
				variant: 'default',
			})
			return
		}
		const deletePromises = querySnapshot.docs.map((file) =>
			deleteDoc(doc(db, 'Files', file.id))
		)

		await Promise.all(deletePromises)
		toast({
			title: 'Success',
			description: 'All trash files have been successfully deleted.',
			variant: 'default',
		})
	} catch (error) {
		console.error('Error deleting trash files:', error)
		toast({
			title: 'Error',
			description: 'Failed to delete trash files. Please try again.',
			variant: 'destructive',
		})
	}
}
const handleRestoreTrash = async () => {
	if (!session) {
		toast({
			title: 'Error',
			description: 'User not logged in.',
			variant: 'destructive',
		})
		return
	}

	toast({
		variant: 'message',
		title: 'Restoring your files',
		description: 'Just a moment',
		action: (
			<ToastAction altText='deleting' className='outline-none border-none'>
				<Loader2 className='animate-spin' />
			</ToastAction>
		),
	})
	const trashQuery = query(
		collection(db, 'Files'),
		where('trash', '==', true),
		where('createdBy', '==', session.user.email) // Filter by user email
	)

	try {
		const querySnapshot = await getDocs(trashQuery)

		if (querySnapshot.empty) {
			toast({
				title: 'No Trash',
				description: 'There are no files in trash.',
				variant: 'default',
			})
			return
		}

		const updatePromises = querySnapshot.docs.map((file) =>
			updateDoc(doc(db, 'Files', file.id), {
				trash: false,
			})
		)

		await Promise.all(updatePromises)

		toast({
			title: 'Success',
			description: 'All files have been restored from trash.',
			variant: 'default',
		})
	} catch (error) {
		console.error('Error clearing trash:', error)
		toast({
			title: 'Error',
			description: 'Could not restore files. Try again later.',
			variant: 'destructive',
		})
	} finally {
	}
}

	console.log(data)
	return (
		<div className='p-2 lg:p-5 mt-5 bg-white rounded-lg flex flex-col gap-0 min-h-[320px] h-full'>
			<div className='flex justify-between items-center'>
				<p className='text-xs lg:text-xl font-bold text-black'>
					{'Trash'}
				</p>
				<div className='flex items-center gap-4 text-black'>
					<div
						className={`p-1 lg:p-2 rounded-full hover:bg-green-500 hover:text-white cursor-pointer  `}
						onClick={() => handleRestoreTrash()}
					>
						<ToolTip
							text={'Restore Trash'}
							item={
								<RotateCcw className='w-4 h-4 lg:w-full' strokeWidth={1} size={13} />
							}
							
							view={view}
						/>
					</div>
					<div
						className={`p-1 lg:p-2 rounded-full hover:bg-red-500 hover:text-white cursor-pointer  `}
						onClick={() => handleClearTrash()}
					>
						<ToolTip
							text={'Empty Trash'}
							item={
								<Trash2 className='w-4 h-4 lg:w-full' strokeWidth={1} size={13} />
							}
							view={view}
						/>
					</div>
					<div
						className={`p-1 lg:p-2 rounded-full hover:bg-black/10 hover:text-black ${
							view === 'list' ? 'bg-black/20' : 'bg-white'
						} `}
						onClick={() => setView('list')}
					>
						<ToolTip
							text={'List layout'}
							item={
								<List className='w-4 h-4 lg:w-full' strokeWidth={1} size={13} />
							}
							view={view}
						/>
					</div>
					<div
						className={`p-1 lg:p-2 rounded-full hover:bg-black/10 hover:text-black ${
							view === 'icons' ? 'bg-black/20 ' : 'bg-white'
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
							view={view}
						/>
					</div>
					<a className='float-right bg-green-500 p-1 lg:p-2 rounded-md  text-white text-xs'>
						View All
					</a>
				</div>
			</div>

			{view === 'list' && <DetailBar state={'file'} />}
			<Separator className={`'mt-0' ${view === 'icons' && 'mt-6'} `} />

			{loading && <Loading2 />}
			{error && <Error error={'An error occurred while loading files.'} />}

			{success && (
				<div
					className={`${
						view === 'icons'
							? `${
									data.length === 0
										? 'flex justify-center items-center w-full h-full '
										: 'w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-2 '
							  } `
							: 'flex flex-col w-full h-full '
					} `}
				>
					{!loading && data.length === 0 ? (
						<div className='w-full h-full flex justify-center items-center'>
							<GifNew text='Files added to Trash will show up here' />
						</div>
					) : (
						<React.Fragment>
							{data.map((item, index) => (
								<div key={index}>
									<FileItem file={item} view={view} />
								</div>
							))}
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
		<div className='w-full h-10  '>
			{loadarray.map((each) => (
				<div key={each} className='w-full h-full mt-2 flex '>
					<div className='w-full flex items-center gap-x-2'>
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
			<h1>{error}</h1>
		</div>
	)
}

export default Trash
