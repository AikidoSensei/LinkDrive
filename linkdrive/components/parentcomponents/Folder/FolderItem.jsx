import { Folder } from 'lucide-react'
import React from 'react'

const FolderItem = ({folder, view}) => {
  return (
		<div
			className={`w-full ${
				view === 'icons'
					? 'h-[130px] border-[1px] rounded-lg p-4 hover:scale-105 duration-200 hover:shadow-lg'
					: 'flex flex-row justify-between items-center px-2 bg-white border-b-[1px] py-4 text-sm hover:bg-blue-300/10'
			} text-black cursor-pointer  `}
		>
			<div
				className={`w-full ${
					view === 'icons'
						? 'flex flex-col justify-center items-center h-full gap-2'
						: 'flex items-center gap-4'
				}  `}
			>
				<Folder size={view === 'icons' ? 30 : 20} />
				<p>{folder}</p>
			</div>
		</div>
	)
}

export default FolderItem
