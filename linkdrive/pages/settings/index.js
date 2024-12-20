"use client"

import SearchBar from '@/components/parentcomponents/SearchBar'
import React from 'react'

const settings = () => {
  return (
    <div className='text-black p-4 flex flex-col gap-2'>
      <SearchBar/>
      <div className='bg-white h-[400px] w-full rounded-xl p-4 flex flex-col'>
        <div className='p-2 bg-black/25 h-20 w-full flex justify-between items-center'>
        <p>View Icon</p>
        <button>x</button>
        </div>
        <div className='p-2 bg-black/25 h-20 w-full flex justify-between items-center'>
        <p>View Icon</p>
        <button>x</button>
        </div>
      Settings
      </div>
    </div>
  )
}

export default settings
