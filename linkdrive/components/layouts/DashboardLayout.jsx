'use client'
import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { Toaster } from '@/components/ui/toaster'
import StorageInfo from '../parentcomponents/StrorageInfo/StorageInfo'
import SearchBar from '../parentcomponents/SearchBar'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { UsedContext } from '@/context/UsedContext'
import { PanelRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'


const DashboardLayout = ({ children }) => {
	const router = useRouter()
	const path = router.pathname
	const [storageOpen, setStorageOpen] = useState(true)
	const [mobile, setMobile] = useState(false)
	
	
	return (
		<div className='w-full h-full flex '>
			{/* side bar component note: side bar provider wraps around all components at _app.js */}
			<SideBarComponent />
			<div className=' w-full grid grid-col-2  md:grid-cols-3 bg-white border-black min-h-screen overflow-y-scroll'>
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
							storage={(e) => {
								setStorageOpen(!storageOpen)
								setMobile(true)
							}}
						/>
					</div>
					{children}
				</div>
				{/* storage container */}
				<div
					className={`${
						storageOpen ? 'col-span-2 md:col-span-1' : 'md:col-span-0'
					} h-screen hidden md:block `}
				>
					<StorageInfo />
				</div>

				{/* <AnimatePresence>
					{mobile && ( */}

				{path === '/app/dashboard/storage'||<motion.div
					key='mobile'
					animate={{ x: 0 }}
					exit={{ x: 1000 }}
					transition={{ type: 'tween' }}
					className={` ${
						mobile ? ' fixed top-0 bottom-0 right-0 ': 'fixed top-0 bottom-0 -right-[1000px]'
					} md:hidden block w-full  bg-white border-l z-[10] h-screen  duration-200`}
				>
					<StorageInfo
						component={
							<div
								className=' flex p-1.5 ml-2 hover:bg-black/5 w-8 h-8 justify-center items-center text-xs text-black rounded-md'
								onClick={() => setMobile(false)}
							>
								<PanelRight size={16} />
							</div>
						}
					/>
				</motion.div>}
			</div>
		</div>
	)
}

export default DashboardLayout
