"use client"
import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Calendar, Home, Inbox, Search, Settings, Folder, FolderPlus, PlusCircle, Trash } from 'lucide-react'
import {
	Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from '@/components/ui/sidebar'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import NewFolderModal from './Folder/NewFolderModal'
import UploadFile from './File/UploadFile'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Geist_Mono } from 'next/font/google'

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const items = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'My Files',
		url: '/Files',
		icon: Inbox,
	},
	{
		title: 'Starred',
		url: '/starred',
		icon: Calendar,
	},
	{
		title: 'Search',
		url: '#search',
		icon: Search,
	},
	{
		title: 'Bin',
		url: '/trash',
		icon: Trash,
	},
	{
		title: 'Settings',
		url: '/settings',
		icon: Settings,
	},
]


// FONTS
const SideBarComponent = () => {
	const router = useRouter()
  return (
		<Sidebar >
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<div className={`'p-1  bg-white shadow-md rounded-xl'`}><Image src={'/linkdrive-logo.png'} width={30} height={30}/></div>
						<p className='text-lg font-bold text-black'>LinkDrive</p>
					</SidebarGroupLabel>
					<SidebarGroup className='gap-2 mb-4 '>
						<Dialog >
							<DialogTrigger asChild>
						<Button className='h-full text-lg bg-green-500 hover:bg-green-400 shadow-lg'>
							<PlusCircle className='scale-125' /> New File
						</Button>
						</DialogTrigger>
						<UploadFile/>
							</Dialog>
						<Dialog>
							<DialogTrigger asChild>
								<Button className='h-full text-lg'>
									<FolderPlus className='scale-125' /> Create New Folder
								</Button>
							</DialogTrigger>
							<NewFolderModal />
						</Dialog>
					</SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className='gap-3'>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={`${
											item.title === 'Bin' &&
											'bg-red-500 text-red duration-200'
										} h-10 ${router.pathname === item.url && 'bg-black/5'}`}
									>
										<a href={item.url}>
											<item.icon className='' />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

export default SideBarComponent
