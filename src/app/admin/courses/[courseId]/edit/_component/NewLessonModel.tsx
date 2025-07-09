"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { tryCatch } from '@/hooks/try-catch'
import { chapterSchema, chapterSchemaType, lessonSchema, lessonSchemaType } from '@/lib/zod.Schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { createChapter, createLesson } from '../action'
import { toast } from 'sonner'

export default function NewLessonModel({courseId, chapterId}: {courseId: string, chapterId:string}) {
  const [isopen, setIsOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name:"",
      courseId: courseId,
      chapterId:chapterId,
    },
  })

  async function onSubmit(values:lessonSchemaType) {
    startTransition(async () => {
      const {data:result, error} = await tryCatch(createLesson(values))

      if(error) {
        toast.error("An unexpected error accured please try again");
        return;
      }

      if(result.status === "success"){
        toast.success(result.message);
        form.reset();
        setIsOpen(false)
      } else if(result.status == "error") {
        toast.error(result.message)
      }
    })
  }
  

  function handleOpenChange(open: boolean){
    setIsOpen(open)
  }
  return (
    <Dialog open={isopen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className='w-full justify-center gap-1' >
          <Plus className='size-4' />
          New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create new Lesson</DialogTitle>
          <DialogDescription>
            What would you like to name your Lesson
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}> 
            <FormField control={form.control} name='name' render={({field}) => 
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder='Lesson Name'  {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            } />

            <DialogFooter>
              <Button disabled={pending}  type='submit'>
                {pending ? "Saving..." : "Save Change"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
