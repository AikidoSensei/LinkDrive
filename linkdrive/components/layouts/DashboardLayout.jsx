'use client'
import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { Toaster } from '@/components/ui/toaster'
import StorageInfo from '../parentcomponents/StrorageInfo/StorageInfo'
import SearchBar from '../parentcomponents/SearchBar'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { UsedContext } from '@/context/UsedContext'

const DashboardLayout = ({ children }) => {
	const router = useRouter()
	const path = router.pathname
	const [storageOpen, setStorageOpen] = useState(true)
	console.log(storageOpen)
	return (
		<div className='w-full h-full flex '>
			<SideBarComponent />
			<div className=' w-full grid  md:grid-cols-3 bg-white border-black min-h-screen overflow-y-scroll'>
				{/* Sidebar */}

				{/* Main Content */}
				<div
					className={`${
						storageOpen ? 'col-span-2' : 'col-span-3'
					} 'gap-0 border-r h-full min-h-screen overflow-y-scroll '`}
				>
					<div className={`'h-max w-full flex items-center '`}>
						<SearchBar
							path={path}
							storage={() => setStorageOpen(!storageOpen)}
						/>
					</div>
					{children}
				</div>
				<div
					className={`${
						storageOpen ? 'col-span-2 md:col-span-1' : 'md:col-span-0'
					} h-screen `}
				>
					<StorageInfo />
				</div>
			</div>
			<Toaster />
		</div>
	)
}

export default DashboardLayout
