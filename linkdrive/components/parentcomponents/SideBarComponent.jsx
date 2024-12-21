import React, { useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
	PlusCircle,
	FolderPlus,
	Home,
	Star,
	Trash,
	Settings,
	HardDrive,
	ChevronLeft,
	ChevronRight,
	Cloud,
	CloudIcon,
} from 'lucide-react'
import UploadFile from './File/UploadFile'
import NewFolderModal from './Folder/NewFolderModal'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { UsedContext } from '@/context/UsedContext'

const items = [
	{ title: 'Home', url: '/app/dashboard', icon: Home, color: 'black' },
	{
		title: 'Starred',
		url: '/app/dashboard/starred',
		icon: Star,
		color: 'yellow-500',
	},
	{
		title: 'Trash',
		url: '/app/dashboard/trash',
		icon: Trash,
		color: 'red-500',
	},
	{
		title: 'Settings',
		url: '/app/dashboard/settings',
		icon: Settings,
		color: 'blue-500',
	},
]

const SideBarComponent = () => {
	const router = useRouter()
	const { usedMemory, setUsedMemory } = useContext(UsedContext)

	const [open, setOpen] = useState(false)
	return (
		<Sidebar className='border-0 bg-white'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<a href='#'>
								<div className='p-1 rounded-xl'>
									<img
										src='/linkdrive-logo.png'
										alt='LinkDrive Logo'
										width={30}
										height={30}
									/>
								</div>
								<p className='text-lg font-bold text-black'>LinkDrive</p>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel></SidebarGroupLabel>
					<SidebarGroup className='gap-2 mb-4'>
						{/* Dialog for New File */}
						<Dialog>
							<DialogTrigger asChild>
								<Button className='h-full text-lg border rounded-xl bg-transparent hover:animate-pulse hover:bg-transparent text-black flex items-center gap-2'>
									<PlusCircle className='scale-125' /> New File
								</Button>
							</DialogTrigger>
							<UploadFile />
						</Dialog>

						{/* Dialog for New Folder */}
						<Dialog>
							<DialogTrigger asChild>
								<Button className='h-full text-lg flex items-center gap-2'>
									<FolderPlus className='scale-125' /> Create New Folder
								</Button>
							</DialogTrigger>
							<NewFolderModal />
						</Dialog>
					</SidebarGroup>

					<SidebarGroupContent>
						<SidebarMenu className='gap-1'>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={`relative h-8 flex items-center px-3 rounded-md transition-all duration-200  ${
											router.pathname === item.url &&
											`bg-green-500/5  before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:h-2 before:rounded-lg before:bg-${item.color}`
										}`}
									>
										<Link href={item.url} className='flex items-center gap-2'>
											<item.icon className='h-5 w-5' />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem
								className={
									' h-8 flex items-center justify-between px-3 rounded-md transition-all duration-200 hover:bg-black/5 cursor-pointer '
								}
								onClick={()=>setOpen(!open)}
							>
								<p className='flex'>
									<CloudIcon className='mr-2 rotate-' size={16} /> Storage
								</p>
								<ChevronRight className={`${open?'-rotate-90':'rotate-90'} duration-200`} size={16} />
							</SidebarMenuItem>
							<div className='w-full h-full overflow-hidden'>
								<AnimatePresence>
									{open&&<motion.div key='storage' initial={{y:-100}} animate={{y:0}} exit={{y:-100}} transition={{type:'tween'}} className='w-full h-max border rounded-xl p-2 flex flex-col justify-between gap-4'>
										<div className='w-full p-4 bg-black rounded-xl h-14 text-md text-white '>
											<div className='h-1 w-3 rounded-full bg-white mr-2'></div>
											Free Tier <span className='font-bold text-md'>Basic</span>
										</div>
										<div className='w-full flex flex-col items-center'>
											<div className='w-full h-1.5 bg-black/10 rounded-full overflow-hidden flex'>
												<div className='h-full rounded-e-full  bg-violet-600 z-[4]'></div>
												<div className='h-full bg-green-600 -ml-1 rounded-e-full z-[3]'></div>
												<div className='h-full bg-yellow-400 rounded-e-full -ml-1 z-[2]'></div>
												<div className='h-full bg-gray-400 rounded-e-full -ml-1 z-[1]'></div>
											</div>
											<p className='mt-2'>{usedMemory} of 50MB used</p>
										</div>
									</motion.div>}
								</AnimatePresence>
							</div>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

export default SideBarComponent
