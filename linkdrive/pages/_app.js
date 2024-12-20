import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { RefreshContext } from '@/context/RefreshContext'
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
				
						<Component {...pageProps} />
					</SidebarProvider>
				</RefreshContext.Provider>
			</ParentFolderContext.Provider>
		</SessionProvider>
	)
}
