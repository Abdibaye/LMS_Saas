import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='relative flex min-h-svh flex-col items-center justify-center'>

        <Link href='/' className={buttonVariants({
          variant: 'outline',
          className: 'absolute left-4 top-4',
        })}>
          <ArrowLeft className='' />
          Back
        </Link>
        <div className='flex flex-col w-full max-w-sm gap-6'>
            <Link href='/' className='text-2xl font-bold text-center'>LMS.</Link>
      {children}

      <div className='text-balance text-muted-foreground text-center'>
        By cliking "Continue with email" you agree to our <Link href='/' className='hover:text-primary hover:underline'>Terms of Service</Link> and <Link href='/' className='hover:text-primary hover:underline'>Privacy Policy</Link>.
      </div>
    </div>
    </div>
  )
}

export default layout
