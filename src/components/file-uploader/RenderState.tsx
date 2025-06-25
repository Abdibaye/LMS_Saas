import { cn } from '@/lib/utils'
import { CloudUploadIcon, ImageIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

export function RenderEmptyState({isDragActive}: {isDragActive: boolean}) {
  return (
    <div className='text-center'>
      <div className='flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-2'>
        <CloudUploadIcon className={cn("size-6 text-muted-foreground", isDragActive && "text-primary/90")} />
      </div>
      <p className='text-base font-semibold text-foreground'>Drop your file here or <span className='text-primary font-bold hover:cursor-pointer'>click to upload</span></p>
      <Button type='button' className='mt-4' >Select File</Button>
    </div>
  )
}

export function RenderErrorState({isDragActive}:{isDragActive: boolean}){
    return(
    <div className='text-center'>
        <div className='flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-2'>
            <ImageIcon className={cn("size-6 text-destructive", isDragActive && "text-primary/90")} />
        </div>   
        <p className='text-base font-semibold'>Upload Failed</p>   
        <p className='text-xs mt-1'>Something went wrong</p>
        <p className='text-xl mt-3 text-foreground'>Click or drag file to retry</p>
        <Button className='mt-4' type='button'>Retry File Selection</Button>
    </div>
    )
}
