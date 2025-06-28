"use client"
import React, {useCallback, useState, useRef} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import {RenderEmptyState, RenderErrorState, RenderUploaded, RenderUploadingState} from './RenderState'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';


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


type UploaderProps = {
  value: string;
  onChange: (value: string) => void;
};


export default function Uploader({onChange,value}:UploaderProps) {

  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: 'image',
    key: value,
  });

  const inputRef = useRef<HTMLInputElement>(null);

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
        fileType: file.type,
        fileSize: file.size,
        isImage: true
      })
    })

    if (!presignedResponse.ok) {
      toast.error("Failed to get presigned URL");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
      return;
    }

    const { presignedUrl, key } = await presignedResponse.json();

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setFileState((prev) => ({
            ...prev,
            progress: Math.round(percentComplete),
            key: key
          }));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 100,
            key: key
          }));
          toast.success("File uploaded successfully");
          onChange(key);
          resolve();
        } else {
          reject(new Error("Upload failed..."));
        }
      };
      xhr.onerror = () => {
        reject(new Error("Upload Failed"));
      };
      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });

   } catch {
    toast.error("Something went wrong")
    setFileState((prev) => ({
      ...prev,
      progress: 0,
      error: true,
      uploading: false
    }));
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
    
      uploadFile(file)
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

  function handleDelete() {
    setFileState({
      ...fileState,
      file: null,
      objectUrl: undefined,
      key: undefined,
      uploading: false,
      progress: 0,
      error: false,
      id: null,
      isDeleting: false,
    });
    onChange('');
  }

  function renderContent() {
    if (fileState.uploading) {
      return <RenderUploadingState progress={fileState.progress} file={fileState.file} />
    }
    if (fileState.error) {
      return <RenderErrorState isDragActive={isDragActive} />
    }
    if (fileState.objectUrl) {
      return <RenderUploaded previewUrl={fileState.objectUrl} onDelete={handleDelete} />
    }
    // Pass the handler to open the file dialog
    return <RenderEmptyState isDragActive={isDragActive} onSelectFile={() => inputRef.current?.click()} />
  }





   const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {"image/*": []}, maxFiles: 1, multiple:false, maxSize:5*1024*1024, onDropRejected: rejectedFiles})
  return (
    <Card className={cn("relative border-2 border-dashed transition-colors duration-100 ease-in-out w-full h-64"
      , isDragActive ? "border-primary bg-primary/10 border-solid": "border-border hover:border-primary"
    )}>  
      <CardContent className='flex items-center justify-center h-full w-full'>
        <input {...getInputProps()} style={{ display: 'none' }} ref={inputRef} />
        {renderContent()}
      </CardContent>
    </Card>
  )
}

