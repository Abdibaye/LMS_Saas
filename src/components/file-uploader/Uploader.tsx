"use client"
import React, {useCallback, useState} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import {RenderEmptyState, RenderErrorState} from './RenderState'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { FileType } from 'lucide-react'

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}


export default function Uploader() {

  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: 'image'
  });

  async function uploadFile(file:File){
    setFileState((prev) => ({...prev,
      uploading: true,
      progress: 0,
  }))

   try{

    const presignedResponse = await fetch('/api/s3/upload', {
      method: "POST",
      headers: {"fileType": "application/json"},
      body: JSON.stringify({
        fileName: file.name,
        FileType: file.type,
        fileSize: file.size,
        isImage: true
      })
    })

    if(!presignedResponse){
      toast.error("Failed to get presigned URL")

      setFileState((prev) => ({...prev,
        uploading: true,
        progress: 0,
        error: true,
    }))

    return;
      
    }

    const {prespresignedUrl, key} = await presignedResponse.json();

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFileState((prev) => ({
          ...prev,
          progress: percentComplete
        }));
      }
      }
    })


   } catch {

   }
  }


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if(acceptedFiles.length > 0){
      const file = acceptedFiles[0]

      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id:uuidv4(),
        isDeleting:false,
        fileType:"image"
      })
    }
  }, []);


  function rejectedFiles(fileRejections: FileRejection[]){
    if(fileRejections.length){
      const tooManyFiles = fileRejections.find((rejection) => 
        rejection.errors[0].code === 'too-many-files'
      );

      if(tooManyFiles) {
        toast.error("To many files selected, max is 1")
      }

      const fileSizeBig = fileRejections.find((rejection) =>
        rejection.errors.some(error => error.code === 'file-too-large')
      )

      if(fileSizeBig){
        toast.error("File size exceeds the limits")
      }

    }
  }
   const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {"image/*": []}, maxFiles: 1, multiple:false, maxSize:5*1024*1024, onDropRejected: rejectedFiles})
  return (
    <Card {...getRootProps()} className={cn("relative border-2 border-dashed transition-colors duration-100 ease-in-out w-full h-64"
      , isDragActive ? "border-primary bg-primary/10 border-solid": "border-border hover:border-primary"
    )}>  
      <CardContent className='flex items-center justify-center h-full w-full'>
        <input {...getInputProps()} />
      <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  )
}
