import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { RefreshContext } from '@/context/RefreshContext'
import { Toaster } from '@/components/ui/toaster'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { useState } from 'react'
import StorageInfo from '@/components/parentcomponents/StrorageInfo/StorageInfo'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'

import { Roboto, Lato, Poppins, Montserrat, Inter, Geist, Geist_Mono } from 'next/font/google'
import { UsedContext } from '@/context/UsedContext'

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
})
const inter = Inter({
	weight: '400',
	subsets: ['latin'],
})
const lato = Lato({
	weight: '400',
	subsets: ['latin'],
})
const montserrat = Montserrat({
	weight: '400',
	subsets: ['latin'],
})
const poppins = Poppins({
	weight: '400',
	subsets: ['latin'],
})
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})
const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})


export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const [parentFolderId, setParentFolderId] = useState(false)
	const [refreshTrigger, setRefreshTrigger] = useState()
	const [crumb, setCrumb] = useState('')
	const [usedMemory, setUsedMemory] = useState({})
const getLayout = Component.getLayout || ((page) => page)
	return (
		<SessionProvider session={session}>
			<ParentFolderContext.Provider
				value={{ parentFolderId, setParentFolderId }}
			>
				<RefreshContext.Provider value={{ refreshTrigger, setRefreshTrigger }}>
					<BreadCrumbContext.Provider value={{ crumb, setCrumb }}>
						<UsedContext.Provider value={{ usedMemory, setUsedMemory }}>
							<main className={`${geistSans.className} overflow-x-hidden`}>
								<SidebarProvider>
									{getLayout(<Component {...pageProps} />)}
								</SidebarProvider>
							</main>
									<Toaster/>
						</UsedContext.Provider>
					</BreadCrumbContext.Provider>
				</RefreshContext.Provider>
			</ParentFolderContext.Provider>
		</SessionProvider>
	)
}
