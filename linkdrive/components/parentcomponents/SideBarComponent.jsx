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
const items = [
	{
		title: 'Home',
		url: '#',
		icon: Home,
	},
	{
		title: 'My Files',
		url: '#',
		icon: Inbox,
	},
	{
		title: 'Starred',
		url: '#',
		icon: Calendar,
	},
	{
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Bin',
		url: '#',
		icon: Trash,
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings,
	},
]


// FONTS
const SideBarComponent = () => {
  return (
		<Sidebar >
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
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
											'bg-red-500 text-white hover:bg-red-600  duration-200 hover:text-white'
										} h-10`}
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
