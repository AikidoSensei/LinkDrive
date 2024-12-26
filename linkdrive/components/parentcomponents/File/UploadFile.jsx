'use client'
import React, { useContext, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { doc, getFirestore, setDoc, increment, updateDoc, getDoc } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { RefreshContext } from '@/context/RefreshContext'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const UploadFile = () => {
	const fileId = Date.now()
	const db = getFirestore(app)
	const { data: session } = useSession()
	const { parentFolderId, setParentFolderId } = useContext(ParentFolderContext)
	const [loading, setLoading] = useState(false)
	const [isuploadFile, setIsUploadFile] = useState(null)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)

	const handleUpload = async (file) => {
		setLoading(true)
		if (!file) {
			setLoading(false)
			toast({
				variant: 'destructive',
				title: 'Empty value provided',
				description: 'It seems you have not selected the file yet',
			})
			return
		}
		try {
			// check if storageLimit has been exceeded
						const userRef = doc(db, 'Users', session.user.email)
					const userDoc = 	await getDoc(userRef)
					const currentStorage = userDoc.data().storageUsed
					const userLimit = userDoc.data().storageLimit
					if (file.size > userLimit){
						toast({
							variant: 'destructive',
							title: 'File large than current tier',
							description: 'Please upgrade to standard plan to continue',
						})
						setLoading(false)
						return
					}
					else if ((file.size + currentStorage) > userLimit ){
						toast({
							variant: 'destructive',
							title: 'Can not upload file',
							description: 'Please upgrade to standard plan to continue',
						})
						setLoading(false)
						return
					}
			// upload file to supabase
			async function uploadFile(file) {
				const { data, error } = await supabase.storage
					.from('linkdrive-storage')
					.upload(`files/${file.name}`, file)

				if (error) {
					setLoading(false)
					console.error('Error uploading file:', error)
					toast({
						variant: 'destructive',
						title: error.error,
						description: error.message,
						action: (
							<ToastAction
								altText='Try again'
								onClick={() => handleUpload(file)}
							>
								Try again
							</ToastAction>
						),
					})
					return null
				}

				// To return public URL of the uploaded file
				const publicURL = supabase.storage
					.from('linkdrive-storage')
					.getPublicUrl(data.path)
				if (!publicURL) {
					toast({
						variant: 'destructive',
						title: 'Network error',
						description: 'Could not store your file',
						action: (
							<ToastAction
								altText='Try again'
								onClick={() => handleUpload(file)}
							>
								Try again
							</ToastAction>
						),
					})
					return
				}

				// write document to firebase
				await setDoc(doc(db, 'Files', fileId.toString()), {
					name: file.name,
					type: file.name.split('.')[1],
					size: file.size,
					modifiedAt: file.lastModified,
					createdBy: session.user.email,
					parentFolderId: parentFolderId,
					imageUrl: publicURL.data.publicUrl,
					id: fileId.toString(),
					starred: false,
					trash: false,
				})
				const userRef = doc(db, 'Users', session.user.email)

				await updateDoc(userRef, {
					storageUsed: increment(file.size), 
				})
				toast({
					variant: 'default',
					title: 'File Uploaded Successfully',
					description: file.name + ' has been uploaded',
				})
				setLoading(false)
				setIsUploadFile(null)
				setRefreshTrigger(!refreshTrigger)
				return
			}
			uploadFile(file)
		} catch (error) {
			console.log(error)
			setLoading(false)
			toast({
				variant: 'destructive',
				title: 'File Upload Failed',
				description: 'Failed to upload file',
				action: (
					<ToastAction altText='Try again' onClick={() => handleUpload(file)}>
						Try again
					</ToastAction>
				),
			})
		}
	}

	return (
		<DialogContent className='sm:max-w-[425px] bg-white '>
			<DialogHeader>
				<DialogTitle className='text-black'>Upload New File</DialogTitle>
			</DialogHeader>
			<div className='grid gap-4 py-4'>
				<div className='grid grid-cols-4 items-center gap-4'>
					<Input
						id='name'
						className='col-span-3 text-black border border-dashed hover:border-2  cursor-pointer duration-200'
						placeholder='Folder name'
						type='file'
						onChange={(e) => setIsUploadFile(e.target.files[0])}
						required
					/>
				</div>
			</div>
			<DialogFooter>
				<Button
					type='submit'
					disabled={loading ? true : false}
					onClick={() => {
						handleUpload(isuploadFile)
					}}
				>
					{loading ? <Loader2 className='animate-spin' /> : <Upload />}
					{loading ? 'Uploading' : 'Upload'}
				</Button>
			</DialogFooter>
		</DialogContent>
	)
}

export default UploadFile
