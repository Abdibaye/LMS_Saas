import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { Trash2 } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { deleteLesson } from '../action'
import { toast } from 'sonner'

export default function DeleteLesson({chapterId,courseId,lessonId}:{chapterId:string, courseId:string,lessonId:string}) {
    const [open,setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    async function onSubmit() {
        startTransition(async () => {
            const {data:result, error} = await tryCatch(deleteLesson({chapterId,courseId,lessonId}))
            if(error) {
                toast.error("An unexpected error accured please try again");
                return;
              }
        
              if(result.status === "success"){
                toast.success(result.message);
                setIsOpen(false)
              } else if(result.status == "error") {
                toast.error(result.message)
              }
            }
        );
    
    }
  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
        <AlertDialogTrigger>
            <Button>
                <Trash2 />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> 
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this lesson.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={onSubmit} disabled={pending}>
                    {pending ? "Deleting..." : "Delete"}
                </Button>
            </AlertDialogFooter>
            
        </AlertDialogContent>
    </AlertDialog>
  )

}