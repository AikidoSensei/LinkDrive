import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button'


const login = () => {
 const {data:session} = useSession();
 const router = useRouter()  
 useEffect(()=>{
  console.log(session)
  if(session){
   router.push('/')
  }
 },[session])
  return (
    <div className='flex justify-center items-center mt-[50%]'> 
      <Button onClick={()=>signIn()} > Sign in with Google</Button>
    </div>
  )
}

export default login
