import { cn } from '@/lib/utils'
import { CloudUploadIcon, ImageIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Image from "next/image";

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

export function RenderUploaded({ previewUrl }: { previewUrl: string }) {
  return (
    <div className="relative flex flex-col items-center w-full h-full">
      <Image
        src={previewUrl}
        alt="Uploaded File"
        fill
        className="object-contain p-2"
      />
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4")}
      >
        <XIcon />
      </Button>
    </div>
  );
}

export function RenderUploadingState({ progress, file }: { progress: number, file?: File | null }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-base font-semibold text-foreground mb-2">Uploading...</p>
      {file && <p className="text-sm text-muted-foreground mb-2">{file.name}</p>}
      <div className="w-40 bg-muted rounded-full h-2 mb-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{progress}%</p>
    </div>
  );
}