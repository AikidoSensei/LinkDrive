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
import { signOut } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/router'

const UserInfo = () => {
	const { data: session } = useSession()
	const router = useRouter();
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
		<React.Fragment>
			{!session?<Loading/>:<div className='w-full h-full flex justify-between items-center p-4 gap-2 '>
				<div className='w-full h-full flex items-center gap-2 p-2 border border-slate-2 rounded-xl'>
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
						<DropdownMenu.Item className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mb-1 hover:bg-blue-500/10 hover:text-blue-600  cursor-pointer text-black ' onClick={()=>{router.push('/settings')}} >
							<Settings2 strokeWidth={1} size={18} /> Settings
						</DropdownMenu.Item>
						<Separator />
				
								<div
									className='flex items-center gap-2 py-1 px-4 w-full outline-none rounded-md mt-1 hover:bg-red-500/10 hover:text-red-600 text-black cursor-pointer '
									onClick={(e) => {
										e.stopPropagation();
										signOut()
	
									}}
								>
									<LogOut strokeWidth={1} size={18} color='red' /> Sign Out
								</div>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>}
		</React.Fragment>
	)
}
const Loading = ()=>{
	return (
		<div className='w-full h-full flex justify-center items-center p-2 gap-2'>
			<div className='w-10 h-10 rounded-full'>
				<Skeleton className='w-full h-full rounded-full' />
			</div>
			<div className='w-[80%] h-full flex flex-col gap-2'>
				<div className='h-5 w-full'>
					<Skeleton className='w-full h-full' />
				</div>
				<div className='h-5 w-full'>
					<Skeleton className='w-full h-full' />
				</div>
			</div>
		</div>
	)
}
export default UserInfo
