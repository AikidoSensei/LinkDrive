"use client"
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import {app} from '@/configuration/FirebaseConfig'
import { Check, Loader2, Plus } from 'lucide-react'
import { useContext, useState } from 'react'
import { useSession } from 'next-auth/react'
import useAsync from '@/hooks/useAsync'

import { useToast } from '@/hooks/use-toast.js'
// import { Button } from '@/components/ui/button'
import {ToastAction } from '@/components/ui/toast'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { RefreshContext } from '@/context/RefreshContext'
const NewFolderModal = () => {
	const {toast} = useToast()
	const [value, setValue] = useState('')
	const db = getFirestore(app)
	const {data:session} = useSession()
	const {parentFolderId, setParentFolderId} = useContext(ParentFolderContext)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	function createTimestamp() {
		const now = new Date()

		// Get hours and minutes
		const hours = now.getHours()
		const minutes = now.getMinutes().toString().padStart(2, '0') // Ensures 2 digits for minutes

		// Format day, month, and year
		const day = now.getDate()
		const year = now.getFullYear()

		// Month names
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		]

		const month = monthNames[now.getMonth()]

		return `${hours}:${minutes} ${day} ${month} ${year}`
	}
	const docId = Date.now().toString()

	// create new folder function also serve to create subfolder by taking in referencing the parentId
	const createFolder = async () => {
	await setDoc(doc(db, 'Folders', docId), {
		name: value,
		id: docId,
		createdBy: session.user.email,
		parentFolderId: parentFolderId,
	})
		setValue('');
	}
	// hook to get state of createfolder function
	const {success, loading, error, execute} = useAsync(createFolder)

	// function to handle the button click
	const handleFunction = async ()=>{
		if (!value){
			toast({
				variant: 'destructive',
				title: 'Failed to create folder',
				description: 'Please input a name for the folder',
				
			})
			return
		}
		await execute();
		
		// show my toast
		toast({
			variant: `${success ? 'default' : 'destructive'}`,
			title: `${success ? 'Folder Created' : 'Folder Creation Failed'}`,
			description: `${
				success ? 'Folder Succefully Created' : 'Failed to create folder'
			}`,
			action: error && (
				<ToastAction altText='Try again' onClick={() => execute()}>
					Try again
				</ToastAction>
			),
		})
		setRefreshTrigger(!refreshTrigger)
	}
	return (
		<DialogContent className='sm:max-w-[425px] bg-white '>
			<DialogHeader>
				<DialogTitle className='text-black'>Create New Folder</DialogTitle>
			</DialogHeader>
			<div className='grid gap-4 py-4'>
				<div className='grid grid-cols-4 items-center gap-4'>
					<Input
						id='name'
						value={value}
						className='col-span-3 text-black'
						placeholder='Folder name'
						onChange={(e) => setValue(e.target.value)}
					/>
				</div>
			</div>
			<DialogFooter>
				<Button type='submit' disabled={loading?true:false} onClick={handleFunction}>
					{loading?<Loader2 className="animate-spin" />:<Plus />}
					{loading?'Creating':'Create'}
				</Button>
			</DialogFooter>
		</DialogContent>
	)
}

export default NewFolderModal
