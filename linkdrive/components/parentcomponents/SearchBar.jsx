"use client";

import {
  Cloud,
  CloudOff,
  MoveLeft,
  MoveRight,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ToolTip from "./ToolTip";
import { useRouter } from "next/navigation";

const SearchBar = (props) => {
  const router = useRouter();

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
    <div className="w-full h-12 flex items-center justify-between gap-2 bg-white rounded-xl p-4">
      <div className="w-24 flex items-center text-slate-700">
        <ToolTip
          item={
            <MoveLeft
              className="cursor-pointer"
              strokeWidth={1}
              onClick={() => router.back()}
            />
          }
          text={"Go back"}
        />
        <ToolTip
          item={
            <MoveRight
              className="cursor-pointer"
              strokeWidth={1}
              onClick={() => router.forward()}
            />
          }
          text={"Forward"}
        />
      </div>

      <div
        className={`w-[60%] h-8 rounded-lg bg-[${props.color}] flex items-center gap-3 border p-2`}
      >
        <Search color="black" size={14} />
        <input
          type="text"
          placeholder="Search"
          className={`bg-transparent outline-none w-full ${props.fontsize} text-black`}
          onKeyDown={(e) => {
            e.key === "Enter" && console.log(e.key);
          }}
        />
      </div>

      <div className="w-24">
        {networkState.isOnline ? (
          <ToolTip
            item={
              <span className="text-xs flex items-center gap-1 text-slate-700">
                <Cloud size={13} color="limegreen" /> Online
              </span>
            }
            text={"Good network connection"}
          />
        ) : (
          <ToolTip
            item={
              <span className="text-xs flex gap-1 text-slate-700">
                <CloudOff size={13} color="red" /> Offline
              </span>
            }
            text={"No network connection"}
          />
        )}
      </div>
    </div>
  );

	}
export default SearchBar;