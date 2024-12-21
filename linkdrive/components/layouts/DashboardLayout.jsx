'use client'
import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { Toaster } from '@/components/ui/toaster'
import StorageInfo from '../parentcomponents/StrorageInfo/StorageInfo'
import SearchBar from '../parentcomponents/SearchBar'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { UsedContext } from '@/context/UsedContext'

const DashboardLayout = ({ children }) => {
	const router = useRouter()
	const path = router.pathname
	return (
		<div className='w-full h-full flex '>
			<SideBarComponent />
			<div className=' w-full grid  md:grid-cols-3 bg-white border-black h-screen'>
				{/* Sidebar */}

				{/* Main Content */}
				<div className='col-span-2 gap-0 border-r h-full min-h-screen  overflow-hidden '>
					<div className={`'h-max w-full flex items-center '`}>
						<SearchBar path={path} />
					</div>
					{children}
				</div>
				<div className='col-span-1 h-screen sticky'>
					<StorageInfo />
				</div>
			</div>
			<Toaster />
		</div>
	)
}

export default DashboardLayout
