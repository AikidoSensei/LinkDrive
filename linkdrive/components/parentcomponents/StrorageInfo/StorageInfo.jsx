"use client"
import React, { useContext, useEffect, useState } from 'react'
import UserInfo from './UserInfo'
import StorageDetails from './StorageDetails'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { RefreshContext } from '@/context/RefreshContext'

const StorageInfo = () => {
	const { data: session } = useSession()
  const {refreshTrigger, setRefreshTrigger} = useContext(RefreshContext)
  const [loading, setLoading] = useState(false)

	const [used, setUsed] = useState(0) 
	const [sizes, setSizes] = useState({
		documents: 0,
		images: 0,
		audio: 0,
		others: 0,
	})

	const [numberOfFiles, setNumberOfFiles] = useState({
		documents: 0,
		images: 0,
		audio: 0,
		others: 0,
	})

	useEffect(() => {
		if (session) {
			getUserFiles()
		}
	}, [session, refreshTrigger])

	const getUserFiles = async () => {
		console.log('Fetching user files...')
    setLoading(true)
		const db = getFirestore(app)
		const q = query(
			collection(db, 'Files'),
			where('createdBy', '==', session.user.email)
		)

		try {
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				toast({
					variant: 'message',
					title: 'You are yet to upload a file',
				})
				setLoading(false)
				return
			}

			let totalUsed = 0
			const fileSizes = {
				documents: 0,
				images: 0,
				audio: 0,
				others: 0,
			}

			const fileCounts = {
				documents: 0,
				images: 0,
				audio: 0,
				others: 0,
			}

			querySnapshot.forEach((doc) => {
				const fileData = doc.data()
				const fileSize = Number(fileData['size'] || 0)
				const fileType = fileData['type']?.toLowerCase() || ''

				totalUsed += fileSize

				// Categorize file sizes and counts
				if (
					['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileType)
				) {
					fileSizes.images += fileSize
					fileCounts.images += 1
				} else if (
					['pdf', 'docx', 'doc', 'txt', 'ppt', 'pptx', 'xlsx', 'csv'].includes(
						fileType
					)
				) {
					fileSizes.documents += fileSize
					fileCounts.documents += 1
				} else if (
					['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'].includes(fileType)
				) {
					fileSizes.audio += fileSize
					fileCounts.audio += 1
				} else {
					fileSizes.others += fileSize
					fileCounts.others += 1
				}
			})

			// Update states
			setUsed(totalUsed)
			setSizes(fileSizes)
			setNumberOfFiles(fileCounts)
      setLoading(false);
			console.log('File Sizes: ', fileSizes)
			console.log('File Counts: ', fileCounts)
			console.log('Total Used: ', totalUsed)
		} catch (error) {
			console.error('Error fetching user files: ', error.message)
			toast({
				variant: 'destructive',
				title: 'Error fetching files',
				description: error.message,
			})
      setLoading(false);
		}
	}
	return (
		<div>
			<UserInfo />
			<StorageDetails used={used} eachSize={sizes} files={numberOfFiles} loading={loading} />
		</div>
	)
}

export default StorageInfo
