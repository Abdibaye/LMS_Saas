"use client";
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/themeToggle';
import { authClient } from '@/lib/auth.client';
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { UserDropDown } from './userDropDown';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';



const navItmes = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

function Navbar() {
    const { data: session, isPending } = authClient.useSession();
  return (
    <header className='sticky top-0 z-50 shadow-md px-2 w-full border-b bg-background/95 backdrop-blur-sm'>
        <div className='flex '>
            <Link href={"/"} className='flex items-center justify-center space-x-2 p-4 text-lg font-bold text-primary hover:text-primary/80'>
                <Image src="/logo2.svg" alt="Logo" width={40} height={40}  />
                <span>LMS</span>
            </Link>
            <nav className='hidden md:flex md:items-center md:justify-between flex-1'>
                <div>
                    <ul className='flex items-center justify-center space-x-4 p-4'>
                        {navItmes.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className='text-sm font-medium text-muted-foreground hover:text-primary'>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='flex items-center justify-center space-x-4 p-4'>
                    <ThemeToggle />
                    {
                        isPending ? (
                            <span className='text-sm text-muted-foreground'>Loading...</span>
                        ) : session ? (
                            <UserDropDown email={session.user.email} image={session.user.image || ""} name={session.user.name}/>
                        ) : (
                            <Link href="/login" className={buttonVariants({
                                variant: 'secondary',
                                size: 'lg',
                            })}>
                                Login
                            </Link>
                        )
                    }
                </div>
            </nav>
        </div>
    </header>
  )
}

export default Navbar
