import React, { useContext, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Loader, Loader2, Trash2, TrashIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js'
import { ToastAction } from '../ui/toast'
import { doc, getFirestore, deleteDoc, increment, updateDoc, getDoc, } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { RefreshContext } from '@/context/RefreshContext'
import { useSession } from 'next-auth/react'


const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)


const DeleteModal = ({name, id, trash, trashState, fileSize}) => {
const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
const {data:session} = useSession()
 const db = getFirestore(app)

const handleDelete = async (name,id) => {
 
 
	if (!name) {
		toast({
			variant: 'destructive',
			title: 'Error',
			description: 'Something went wrong',
		})
		return
	}
 
 // show deleting toast
 toast({
		variant: 'destructive',
		title: 'Deleting',
		description: 'Just a moment',
		action: (
			<ToastAction altText='deleting' className='outline-none border-none'>
				<Loader2 className='animate-spin' />
			</ToastAction>
		),
 })


 // delete file from *supabase*
	try {
		const { data, error } = await supabase.storage
			.from('linkdrive-storage')
			.remove([`files/${name}`])
   console.log('Supabase Response:', { data, error })

			if (error) {
				console.error('Error deleting file:', error)
				toast({
					variant: 'destructive',
					title: error.error,
					description: error.message,
					action: (
						<ToastAction altText='Try again' onClick={() => handleDelete(name, id)}>
							Try again
						</ToastAction>
					),
				})
				return null
			}

// delete from *firebase*
			await deleteDoc(doc(db, "Files", id));

			toast({
				variant: 'default',
				title: 'File Deleted Successfully',
				description: name + ' has been deleted', 
			})
			const userRef = doc(db, 'Users', session.user.email)

			const userDoc = await getDoc(userRef)
			const currentStorage = userDoc.data().storageUsed || 0

			const newStorage = Math.max(0, currentStorage - fileSize)

			// Update the user's storageUsed
			await updateDoc(userRef, {
				storageUsed: newStorage,
			})
	setRefreshTrigger(!refreshTrigger)
	} catch (error) {
		console.log(error)
		toast({
			variant: 'destructive',
			title: 'Failed to delete file',
			action: (
				<ToastAction altText='Try again' onClick={() => handleDelete(name,id)}>
					Try again
				</ToastAction>
			),
		})
	}
}


  return (
		<AlertDialogContent
			className='bg-white '
			onClick={(e) => e.stopPropagation()}
		>
			<AlertDialogHeader>
				<AlertDialogTitle className='text-black/70'>
					Are you sure?
				</AlertDialogTitle>
				<AlertDialogDescription>
					This will permanently delete the File you may have to re-upload the
					file again.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter className='flex'>
					<AlertDialogAction onClick={()=>trash() }>
					<TrashIcon/>	{trashState ? 'Remove from trash' : 'Move to trash'}
					</AlertDialogAction>
				<div className='w-full flex items-center justify-around gap-2'>
					<AlertDialogCancel className='bg-black text-white outline-none hover:outline-none hover:bg-black hover:text-white'>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className='bg-red-500 hover:bg-red-600 '
						onClick={() => handleDelete(name, id)}
					>
						<Trash2 /> Continue
					</AlertDialogAction>
				</div>
			</AlertDialogFooter>
		</AlertDialogContent>
	)
}


export default DeleteModal
