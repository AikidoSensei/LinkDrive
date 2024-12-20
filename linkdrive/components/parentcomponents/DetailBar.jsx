import React from 'react'

const DetailBar = ({state}) => {
  return (
		<div
			className={`'w-full  lg:h-10 grid ${
				state === 'folder' ? 'grid-cols-2' : 'grid-cols-5'
			} items-center text-slate-500 mt-2 text-[8pt] lg:text-sm'`}
		>
			<p className={`${state === 'folder' ? 'col-span-1' : 'col-span-2'}`}>
				Name
			</p>
			<p className='col-span-1'>Modified</p>
			{state === 'file' && <p className='col-span-1 ml-12  '>Size</p>}
		</div>
	)
}

export default DetailBar
