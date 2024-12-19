"use client"

import React from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
const ToolTip = ({ item, text, trigger, view }) => {
	console.log(view)
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className='w-full h-full z-10'>{item}</span>
				</TooltipTrigger>
				<TooltipContent>
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default ToolTip
