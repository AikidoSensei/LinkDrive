import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const index = () => {
 const {data:session} = useSession()
 const router = useRouter()
useEffect(()=>{
 if(!session){
  router.push('/login')
 }
 else{router.push('/app/dashboard')}
},[session])
  return (
    <div className='w-screen h-screen flex justify-center items-center text-black'>
      <h1>HELLO WORLD</h1>
    </div>
  )
}

export default index
