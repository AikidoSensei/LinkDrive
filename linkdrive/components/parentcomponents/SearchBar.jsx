"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Cloud,
  CloudOff,
  MoveLeft,
  MoveRight,
  Search,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ToolTip from "./ToolTip";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { BreadCrumbContext } from '@/context/BreadCrumbContext';
import { ParentFolderContext } from '@/context/ParentFolderContext';
const SearchBar = (props) => {
	const {crumb, setCrumb} = useContext(BreadCrumbContext)
	const { parentFolderId, setParentFolderId } = useContext(ParentFolderContext)
  const router = useRouter();
  console.log(parentFolderId)
  const [networkState, setNetworkState] = useState({
    isOnline: true, 
    effectiveType: "",
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const updateNetState = () => {
      const connection = navigator.connection;
      setNetworkState({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || "unknown",
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
      });
    }
window.removeEventListener("online", updateNetState);
      window.removeEventListener("offline", updateNetState);
    }
  , []);

  return (
		<div className='w-full h-14 flex items-center justify-between gap-2 bg-white  px-2 py-4 border-b'>
			<div className='flex items-center justify-between gap-2'>
				<SidebarTrigger className='-ml-1 text-black' />
				<Separator orientation='vertical' className='mr-2 h-4' />

				<div className='w-24 flex items-center text-slate-700'>
					<ToolTip
						item={
							<MoveLeft
								className='cursor-pointer'
								strokeWidth={1}
								onClick={() => router.back()}
							/>
						}
						text={'Go back'}
					/>
					<ToolTip
						item={
							<MoveRight
								className='cursor-pointer'
								strokeWidth={1}
								onClick={() => router.forward()}
							/>
						}
						text={'Forward'}
					/>
				</div>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className='hidden md:block text-xs text-ellipsis line-clamp-1'>
							<BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className='hidden md:block' />
						<BreadcrumbItem className='hidden md:block text-xs'>
							<BreadcrumbPage>
								{crumb}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div
				className={`w-[30%] h-8 rounded-lg bg-[${props.color}] flex items-center gap-3 border p-2`}
			>
				<Search color='black' size={14} />
				<input
					type='text'
					placeholder='Search'
					className={`bg-transparent outline-none w-full ${props.fontsize} text-black`}
					onKeyDown={(e) => {
						e.key === 'Enter' && console.log(e.key)
					}}
				/>
			</div>

			<div className='w-24'>
				{networkState.isOnline ? (
					<ToolTip
						item={
							<span className='text-xs flex items-center gap-1 text-slate-700'>
								<Cloud size={13} color='limegreen' /> Online
							</span>
						}
						text={'Good network connection'}
					/>
				) : (
					<ToolTip
						item={
							<span className='text-xs flex gap-1 text-slate-700'>
								<CloudOff size={13} color='red' /> Offline
							</span>
						}
						text={'No network connection'}
					/>
				)}
			</div>
		</div>
	)

	}
export default SearchBar;