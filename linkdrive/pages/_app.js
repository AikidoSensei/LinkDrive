import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<SessionProvider session={session}>
			<SidebarProvider>
					<SideBarComponent />
          <SidebarTrigger className='text-black bg-white mt-2 -ml-[1px] rounded-ss-none rounded-bl-none'/>
					<div className='grid grid-cols-1 md:grid-cols-3 w-full'>
						<div className='col-span-2'>  
							<Component {...pageProps} />
						</div>
						<div className='bg-green-400 w-full h-full'>storage</div>
					</div>
			</SidebarProvider>
		</SessionProvider>
	)
}
