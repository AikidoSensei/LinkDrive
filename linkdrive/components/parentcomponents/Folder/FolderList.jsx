import React, { useState } from 'react'
import FolderItem from './FolderItem'
import { Separator } from '@/components/ui/separator'
import ToolTip from '../ToolTip'
import { LayoutGrid, List } from 'lucide-react'

const FolderList = () => {
	const list = [
		{ name: 'My Files' },
		{ name: 'Stuffs' },
		{ name: 'Docs' },
		{ name: 'Images' },
		{ name: 'Invoices' },
	]
	const [view, setView] = useState('list')

	return (
		<div className='p-5 mt-5 bg-white rounded-lg flex flex-col gap-0 '>
			<div className='flex justify-between'>
				<p className='text-xl font-bold text-black '>Recent Folders</p>
				<div className='flex items-center gap-4 text-black'>
					<ToolTip
						text={'List layout'}
						item={<List />}
						trigger={() => setView('list')}
						view={view}
					/>
					<ToolTip
						text={'Grid layout'}
						item={<LayoutGrid />}
						trigger={() => setView('icons')}
						view={view}
					/>
					<a className='float-right bg-green-500 p-2 rounded-xl text-white'>
						View All
					</a>
				</div>
			</div>
			<Separator className='mt-2' />
			<div
				className={`${
					view === 'icons'
						? 'w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-4'
						: 'flex flex-col w-full h-full '
				} `}
			>
				{list.map((item) => {
					return <FolderItem folder={item.name} view={view} />
				})}
			</div>
		</div>
	)
}

export default FolderList
