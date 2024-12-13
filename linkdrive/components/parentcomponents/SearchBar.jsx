import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = (props) => {
  return (
    <div className={`w-full h-full rounded-3xl bg-[${props.color}] flex items-center gap-3 border p-4`}>
      <Search color='black' size={14}/>
      <input type="text" placeholder='Search' className={`bg-transparent outline-none w-full ${props.fontsize} text-black`} onKeyDown={(e)=>{e.key==='Enter'&&console.log(e.key)}}/>
    </div>
  )
}

export default SearchBar
