import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Folder,
	FolderOpen,
	LogOut,
	LucideMoreVertical,
	MoreVertical,
	MoreVerticalIcon,
	Settings,
	Settings2,
	Trash2,
 UserX,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import ToolTip from '../ToolTip'
import DeleteFolderModal from '../DeleteFolderModal'

const UserInfo = () => {
	const { data: session } = useSession()
	let initials = ''

	const name = session?.user?.name || ''
 const image = session?.user?.image || ''
 const email = session?.user?.email || ''
	if (name) {
		const arr = name.split(' ')
		const first = arr[0]?.charAt(0) || ''
		const second = arr[1]?.charAt(0) || ''
		initials = first + second
	}
	return (
		<div className='w-full h-full flex justify-between items-center p-4'>
			<div className='w-full h-full flex items-center gap-2 '>
				<Avatar className='bg-blue-300 text-black'>
					<AvatarImage src={image} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<ToolTip
					item={
						<div className='w-full h-full flex flex-col text-black'>
							<p className='text-xs font-bold text-slate-800'>{name}</p>
							<p className='text-xs font-thin text-slate-700'>{email}</p>
						</div>
					}
					text={
						<div className='w-full h-full flex flex-col text-black'>
							<p className='text-xs font-bold text-white'>{name}</p>
							<p className='text-xs font-thin text-white'>{email}</p>
						</div>
					}
				/>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<a
						className={`flex justify-center items-center w-max p-2 rounded-full hover:bg-black/5 duration-200 text-black`}
					>
						<ToolTip
							item={<Settings size={25} strokeWidth={1} />}
							text={'Settings'}
						/>
					</a>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					className='bg-white py-1 px-1 rounded-md w-[200px] shadow-md border border-slate-300 z-20'
					side='right'
					align='start'
				>
					<DropdownMenu.Item className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mb-1 hover:bg-blue-500/10 hover:text-blue-600  cursor-pointer text-black '>
						<Settings2 strokeWidth={1} size={18} /> Settings
					</DropdownMenu.Item >
					<Separator />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<div
								className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mt-1 hover:bg-red-500/10 hover:text-red-600 text-black '
								onClick={(e) => e.stopPropagation()}
							>
								<LogOut strokeWidth={1} size={18} color='red' /> Sign Out
							</div>
						</AlertDialogTrigger>
						<DeleteFolderModal  />
					</AlertDialog>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}

export default UserInfo
