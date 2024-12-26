'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useContext } from 'react'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'

import { LayoutGrid, List } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import ToolTip from '@/components/parentcomponents/ToolTip'
import DetailBar from '@/components/parentcomponents/DetailBar'
import GifNew from '@/components/parentcomponents/GifNew'
import FileItem from '@/components/parentcomponents/File/FileItem'
import { RefreshContext } from '@/context/RefreshContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import link from '@/public/black-link.json'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
const Starred = () => {
	const db = getFirestore(app)
	const { data: session, status } = useSession()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	const { crumb, setCrumb } = useContext(BreadCrumbContext)

	const [view, setView] = useState('list')

	useEffect(() => {
		setCrumb('Favourites')
		if (status === 'unauthenticated') {
			router.push('/login')
		} else if (status === 'authenticated') {
			const fetchStarredFiles = async () => {
				setLoading(true)
				setError(false)
				setSuccess(false)

				try {
					const querySnapshot = await getDocs(collection(db, 'Files'))
					const starredFiles = []

					querySnapshot.forEach((doc) => {
						const file = doc.data()
						if (file.starred === true) {
							starredFiles.push({ id: doc.id, ...file })
						}
					})

					setData(starredFiles)
					setSuccess(true)
				} catch (err) {
					console.error('Error fetching starred files:', err)
					setError(true)
				} finally {
					setLoading(false)
				}
			}
			fetchStarredFiles()
		}
	}, [session, refreshTrigger])
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
		<div className='p-2 lg:p-5 mt-5 bg-white  flex flex-col gap-0 min-h-[320px] h-full'>
			<div className='flex justify-between items-center'>
				<p className='text-xs lg:text-xl font-bold text-black'>{'Favourite'}</p>
				<div className='flex items-center gap-4 text-black'>
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
							<GifNew text='Your starred files will show up here' />
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
Starred.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default Starred
