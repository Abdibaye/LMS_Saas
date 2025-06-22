"use client";
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/themeToggle'
import { authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

function page() {
  const router = useRouter();
   const { 
        data: session, 
    } = authClient.useSession() 

  async function handleLogout() {
    await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
      toast.success("Logged out successfully");
    },
  },
});}
 
  return (
    <div className='text-2xl text-center text-blue-500'>
      hello  from main page
      <ThemeToggle />
      <div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}

export default page
