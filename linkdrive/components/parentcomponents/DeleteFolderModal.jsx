import React, { useContext, useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { FolderX, Loader, Loader2, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js'
import { ToastAction } from '../ui/toast'
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
} from 'firebase/firestore'

import { app } from '@/configuration/FirebaseConfig'
import { RefreshContext } from '@/context/RefreshContext'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const DeleteFolderModal = ({folderId, name}) => {
	const db = getFirestore(app)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)

	const handleDeleteFolder = async ( id, path ) => {
  console.log(id, path)
		if (!id) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Something went wrong',
			})
			return
		}
		try {
			toast({
				variant: 'destructive',
				title: 'Deleting Folder and contents',
				description: 'Just a moment',
				action: (
					<ToastAction altText='deleting' className='outline-none border-none'>
						<Loader2 className='animate-spin' />
					</ToastAction>
				),
			})
			// Step 1: Delete all files in the current folder from Firestore and Supabase
			const filesQuery = query(
				collection(db, 'Files'),
				where('parentFolderId', '==', id)
			)
			const filesSnapshot = await getDocs(filesQuery)

			for (const fileDoc of filesSnapshot.docs) {
				const fileData = fileDoc.data()
				const filePath = fileData.path // Supabase file path (e.g., 'linkdrive-storage/file1.pdf')

				// Delete file from Supabase Storage
				const { error: supabaseError } = await supabase.storage
					.from('linkdrive-storage') // Replace with your Supabase bucket name
					.remove([filePath])

				if (supabaseError) {
					console.error(
						`Failed to delete file from Supabase: ${filePath}`,
						supabaseError
					)
					toast({
						variant: 'destructive',
						title: `Failed to delete`,
						description: supabaseError.message,
						action: (
							<ToastAction
								altText='Try again'
								onClick={() => handleDeleteFolder(id, path)}
							>
								Try again
							</ToastAction>
						),
					})
     return null
				} 

				// delete file document from Firestore
				await deleteDoc(doc(db, 'Files', fileDoc.id))
				console.log(`Deleted file document: ${fileDoc.id}`)
// •••••••••••••••loading
			}
			// Step 2: Find all subfolders of the current folder
			console.log(`Finding subfolders of folder: ${id}`)
			const subfoldersQuery = query(
				collection(db, 'Folders'),
				where('parentFolderId', '==', id)

			)
			const subfoldersSnapshot = await getDocs(subfoldersQuery)

			// Recursively delete each subfolder
			for (const subfolderDoc of subfoldersSnapshot.docs) {
				await handleDeleteFolder(subfolderDoc.id)
			}

			// Step 3: Delete the current folder document
			console.log(`Deleting folder: ${id}`)
			await deleteDoc(doc(db, 'Folders', id))
			console.log(`Deleted folder document: ${id}`)
   toast({
			variant: 'default',
			title: 'Folder Deleted Successfully',
			description: 'Folder has been deleted',
		})
  	setRefreshTrigger(!refreshTrigger)

		} catch (error) {
			console.error(`Error deleting folder ${id}:`, error)
   toast({
			variant: 'destructive',
			title: error.error,
			description: error.message,
			action: (
				<ToastAction altText='Try again' onClick={() => handleDeleteFolder(folderId, name)}>
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
					This will permanently delete the Folder and it's content
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel className='bg-black text-white outline-none hover:outline-none hover:bg-black hover:text-white'>
					Cancel
				</AlertDialogCancel>
				<AlertDialogAction
					className='bg-red-500 hover:bg-red-600 '
					onClick={() => handleDeleteFolder(folderId, name)}
				>
					<FolderX /> Continue
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	)
}

export default DeleteFolderModal
