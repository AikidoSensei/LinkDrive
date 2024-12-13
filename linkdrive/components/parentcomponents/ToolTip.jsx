import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip'
const ToolTip = ({item, text, trigger, view}) => {
 console.log(view)
  return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className={`p-2 rounded-full hover:bg-black/10 hover:text-black ${
							view === 'icons' && text === 'Grid layout'
								? 'bg-black/5 text-black'
								: 'bg-white text-black'
						} ${
							view === 'list' && text === 'List layout'
								? 'bg-black/5 text-black'
								: 'bg-white text-black'
						}`}
						onClick={() => trigger()}
					>
						{item}
					</span>
				</TooltipTrigger>
				<TooltipContent>
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default ToolTip
