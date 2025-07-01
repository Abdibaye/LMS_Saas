'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseCategorySchema, courseLevelSchema, courseSchema, CourseSchemaType, courseStatusSchema } from '@/lib/zod.Schema'
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Courselevel } from '@/generated/prisma'
import RichTextEditor from '@/components/rich-text-editor/textEditor'
import Uploader from '@/components/file-uploader/Uploader'
import { tryCatch } from '@/hooks/try-catch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { editCourse } from '../action'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-cours'

interface iAppProps {
    data:AdminCourseSingularType
}

export default function EditCourseForm({data}: iAppProps) {
        const [Pending, startTransition] = useTransition();
        const router = useRouter()

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
          title: data.title,
          description: data.description,
          category: data.category as CourseSchemaType['category'], 
          smallDescription: data.category,
          slug: data.slug,
          fileKey: data.fileKey,
          level: data.level,
          price: data.price,
          duration: data.duration,
          status: data.status,
        },
      })

        function onSubmit(values: CourseSchemaType) {
          console.log('Form submitted with values:', values);
          
          startTransition(async () => {
              try {
                  const { data: result, error } = await tryCatch(editCourse(values,data.id))
                  
                  console.log('Action response:', { data, error });
                  
                  if(error){
                      console.error('Action error:', error);
                      toast.error("An unexpected error occurred. Please try again");
                      return
                  } 
                  if(data.status == "success"){
                      toast.success(data.message)
                      form.reset()
                      router.push('/admin/courses')
                  } else if(data.status == "error") {
                      toast.error(data.message)
                  }
              } catch (err) {
                  console.error('Form submission error:', err);
                  toast.error("Failed to submit form. Please try again.");
              }
          })
        }  

  return (
    <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="title" 
                    render={({ field }) => (
                        <FormItem className='mb-4'>
                            <FormLabel htmlFor="title">Course Title</FormLabel>
                            <FormControl> 
                                <Input placeholder='Enter course title' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                     <div className='flex gap-4 items-center'>
                        <FormField control={form.control} name="slug" 
                    render={({ field }) => (
                        <FormItem className='mb-4 w-full'>
                            <FormLabel htmlFor="slug">Slug</FormLabel>
                            <FormControl> 
                                <Input placeholder='Slug' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <Button type="button" className='mt-1'  onClick={
                        () => {
                            const title = form.getValues('title');
                            if (title) {
                                const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                                form.setValue('slug', slug);
                            }
                        }
                    }> 
                        Generate Slug 
                        <SparkleIcon className='ml-2' />
                    </Button>
                     </div>

                    <FormField control={form.control} name="smallDescription" 
                    render={({ field }) => (
                        <FormItem className='mb-4'>
                            <FormLabel htmlFor="Small Description">Small Description</FormLabel>
                            <FormControl> 
                                <Textarea placeholder='Write small description' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <FormField control={form.control} name="description" 
                    render={({ field }) => (
                        <FormItem className='mb-4'>
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <RichTextEditor field={field} />
                            {/* <FormControl> 
                                <Textarea className='min-h-[120px]' placeholder='Write description' {...field} />
                            </FormControl> */}
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <FormField control={form.control} name="fileKey" 
                    render={({ field }) => (
                        <FormItem className='mb-4 w-full'>
                            <FormLabel>Thumbnail image</FormLabel>
                            <FormControl>
                                <Uploader value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <div className='grid grid-cols-1  md:grid-cols-2 gap-4'> 
                         <FormField control={form.control} name="category" 
                    render={({ field }) => (
                        <FormItem className='mb-4 w-full'>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}> 
                                <FormControl>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseCategorySchema.options.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>)) }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <FormField control={form.control} name="level" 
                    render={({ field }) => (
                        <FormItem className='mb-4 w-full'>
                            <FormLabel>Level</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}> 
                                <FormControl>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseLevelSchema.options.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>)) }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <FormField control={form.control} name="duration" 
                    render={({ field }) => (
                        <FormItem className='mb-4'>
                            <FormLabel>Duration (hours)</FormLabel>
                            <FormControl> 
                                <Input placeholder='Duration' type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <FormField control={form.control} name="price" 
                    render={({ field }) => (
                        <FormItem className='mb-4'>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl> 
                                <Input placeholder='Price' type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>
                    </div>

                    <FormField control={form.control} name="status" 
                    render={({ field }) => (
                        <FormItem className='mb-4 w-full'>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}> 
                                <FormControl>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseStatusSchema.options.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>)) }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}> 
                    </FormField>

                    <Button type="submit" className='mt-4' disabled={Pending}>
                        
                       {
                        Pending ? (
                            <>
                            Update...

                            <Loader2 className='animate-spin' />
                            </>
                        ):
                         (
                            <>
                            Update Course
                             <PlusIcon className='ml-2' />
                            </>
                         )
                        
                       }
                    </Button>
                </form>
            </Form>
  )
}
