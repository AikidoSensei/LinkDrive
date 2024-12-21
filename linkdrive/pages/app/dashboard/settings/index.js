'use client'
import dynamic from 'next/dynamic'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import SearchBar from '@/components/parentcomponents/SearchBar'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ToastAction } from '@/components/ui/toast'
import { app } from '@/configuration/FirebaseConfig'
import { toast } from '@/hooks/use-toast'
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	getDocs,
	query,
	collection,
	where,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore'
import {
	Loader2,
	LucideArchiveRestore,
	Save,
	StarIcon,
	TrashIcon,
	User2,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import link from '@/public/black-link.json'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const Settings = () => {
	const router = useRouter()
	const db = getFirestore(app)
	const { data: session, status } = useSession()
	const { crumb, setCrumb } = useContext(BreadCrumbContext)

	const [config, setConfig] = useState({
		view: true,
		defaultFolder: true,
	})

	useEffect(() => {
		setCrumb('Settings')
		if (status === 'unauthenticated') {
			router.push('/login')
		} else if (status === 'authenticated') {
			const fetchUserConfig = async () => {
				try {
					const userSettingsRef = doc(db, 'Settings', session.user.email)

					const docSnap = await getDoc(userSettingsRef)

					if (docSnap.exists()) {
						const userConfig = docSnap.data()
						setConfig({
							view: userConfig.view ?? true,
							defaultFolder: userConfig.defaultFolder ?? true,
						})
					} else {
						console.log('No user settings found, using defaults.')
					}
				} catch (error) {
					console.error('Error fetching user settings:', error)
					toast({
						title: 'Error',
						description:
							'Failed to load your settings. Please refresh the page.',
						variant: 'destructive',
					})
				}
			}
			fetchUserConfig()
		}
	}, [session])

	const handleSave = async () => {
		if (!session) return

		try {
			toast({
				title: 'Saving...',
				description: 'Your settings are being saved. Please wait...',
				variant: 'message',
				action: (
					<ToastAction altText='saving' className='outline-none border-none'>
						<Loader2 className='animate-spin' />
					</ToastAction>
				),
			})

			const userSettingsRef = doc(db, 'Settings', session.user.email)
			await setDoc(
				userSettingsRef,
				{
					...config,
					createdBy: session.user.email,
					updatedAt: new Date().toISOString(),
				},
				{ merge: true }
			)

			toast({
				title: 'Success',
				description: 'Your settings have been saved successfully.',
				variant: 'default',
			})
		} catch (error) {
			console.error('Error saving settings:', error)

			toast({
				title: 'Error',
				description: 'Failed to save your settings. Please try again.',
				variant: 'destructive',
			})
		}
	}
	const handleClearStarred = async () => {
		console.log('clearing starred')
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
			title: 'Removing all files from starred',
			description: 'Just a moment',
			action: (
				<ToastAction altText='deleting' className='outline-none border-none'>
					<Loader2 className='animate-spin' />
				</ToastAction>
			),
		})
		const trashQuery = query(
			collection(db, 'Files'),
			where('starred', '==', true),
			where('createdBy', '==', session.user.email) // Filter by user email
		)

		try {
			const querySnapshot = await getDocs(trashQuery)

			if (querySnapshot.empty) {
				toast({
					title: 'No files added to favourite',
					description: 'There are no files in starred.',
					variant: 'default',
				})
				return
			}

			const updatePromises = querySnapshot.docs.map((file) =>
				updateDoc(doc(db, 'Files', file.id), {
					starred: false,
				})
			)

			await Promise.all(updatePromises)

			toast({
				title: 'Success',
				description: 'All files have been removed from starred.',
				variant: 'default',
			})
		} catch (error) {
			console.error('Error clearing trash:', error)
			toast({
				title: 'Error',
				description: 'Could not clear files from starred. Try again later.',
				variant: 'destructive',
			})
		} finally {
		}
	}
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

	if (status === 'loading') {
		return (
			<div className='w-full col-span-2 flex justify-center items-center h-screen z-[1000] text-black'>
				<div className='w-[100px] h-[100px] bg-black rounded-3xl flex items-center justify-center'>
					<div className=' bg-white rounded-full shadow-xl p-1 w-[50px]'>
						<Lottie animationData={link} />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='text-black flex flex-col overflow-y-scroll '>
			<div className=' h-screen w-full overflow-y-scroll flex flex-col p-4 gap-y-4'>
				<h1 className='font-bold text-xl'>Settings</h1>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center'>
					<p>View Icon</p>
					<Switch
						id='view-icon'
						checked={config.view}
						onCheckedChange={(checked) =>
							setConfig((prev) => ({ ...prev, view: checked }))
						}
					/>
				</div>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center'>
					<p>Default Folder Icon</p>
					<Switch
						id='default-folder-icon'
						checked={config.defaultFolder}
						onCheckedChange={(checked) =>
							setConfig((prev) => ({ ...prev, defaultFolder: checked }))
						}
					/>
				</div>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center opacity-50'>
					<p className='text-black/50'>
						Sharing{' '}
						<span className='text-xs text-black/20'>feature coming soon</span>
					</p>
					<Switch id='sharing-feature' disabled />
				</div>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center opacity-50'>
					<p className='text-black/50'>
						Notifications{' '}
						<span className='text-xs text-black/20'>feature coming soon</span>
					</p>
					<Switch id='sharing-feature' disabled />
				</div>
				<div className='w-full'>
					<Button
						className='float-end bg-black text-white hover:bg-green-500'
						onClick={handleSave}
					>
						<Save /> Save
					</Button>
				</div>
				<Separator />
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center'>
					<p>Clear Stared</p>
					<Button
						className='bg-yellow-300 text-white'
						onClick={() => {
							handleClearStarred()
						}}
					>
						<StarIcon fill='yellow' />
						Clear Starred
					</Button>
				</div>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center'>
					<p>Trash</p>
					<div className='w-max flex items-center gap-3'>
						<Button
							className='bg-green-500 text-white hover:bg-green-600'
							onClick={() => handleRestoreTrash()}
						>
							<LucideArchiveRestore />
							Restore Trash
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className='bg-red-500 text-white'>
									<TrashIcon />
									Empty Trash
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent
								className='bg-white '
								onClick={(e) => e.stopPropagation()}
							>
								<AlertDialogHeader>
									<AlertDialogTitle className='text-black/70'>
										Are you sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently delete all Files, Folders and their
										contents.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className='bg-black text-white outline-none hover:outline-none hover:bg-black hover:text-white'>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										className='bg-red-500 text-white'
										onClick={() => handleClearTrash()}
									>
										<TrashIcon />
										Empty Trash
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center mt-20'>
					<p>Memory Allocated</p>
					<h2 className='font-bold text-lg select-none'>50MB</h2>
				</div>
				<div className='p-2 border border-slate-100 rounded-xl h-14 w-full flex justify-between items-center'>
					<p>Sign Out</p>
					<Button
						className='bg-black text-white'
						onClick={(e) => {
							e.stopPropagation()
							signOut()
						}}
					>
						<User2 />
						Sign Out
					</Button>
				</div>
			</div>
		</div>
	)
}
Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default Settings
