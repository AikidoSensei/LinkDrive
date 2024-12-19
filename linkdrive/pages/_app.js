import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { RefreshContext, ToastContext } from '@/context/RefreshContext'
import { Toaster } from '@/components/ui/toaster'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { useState } from 'react'
import StorageInfo from '@/components/parentcomponents/StrorageInfo/StorageInfo'
export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const [parentFolderId, setParentFolderId] = useState(false)
	const [refreshTrigger, setRefreshTrigger] = useState()
	return (
		<SessionProvider session={session}>
			<ParentFolderContext.Provider
				value={{ parentFolderId, setParentFolderId }}
			>
				<RefreshContext.Provider value={{ refreshTrigger, setRefreshTrigger }}>
					<SidebarProvider>
						<SideBarComponent />
						<SidebarTrigger className='fixed text-black bg-black/5 backdrop:blur-md mt-2 -ml-[1px] rounded-ss-none rounded-bl-none' />
						<div className='grid grid-cols-1 md:grid-cols-3 w-full'>
							<div className='col-span-2'>
								<Component {...pageProps} />
							</div>
							<div className='bg-white shadow-xl w-full h-full rounded-xl'>
								<StorageInfo />
							</div>
						</div>
					</SidebarProvider>
					<Toaster />
				</RefreshContext.Provider>
			</ParentFolderContext.Provider>
		</SessionProvider>
	)
}
