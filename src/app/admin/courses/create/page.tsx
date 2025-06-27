'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseCategorySchema, courseLevelSchema, courseSchema, CourseSchemaType, courseStatusSchema } from '@/lib/zod.Schema'
import { ArrowLeft, PlusIcon, SparkleIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Courselevel } from '@/generated/prisma'
import RichTextEditor from '@/components/rich-text-editor/textEditor'
import Uploader from '@/components/file-uploader/Uploader'

export default function CourseCreationPage() {
     // 1. Define your form.
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'web-development', 
      smalldescription: '',
      slug: '',
      fileKey: '',
      level: 'beginner',
      price: 0,
      duration: '',
      status: 'draft',
    },
  })

  function onSubmit(values: CourseSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <> 
    <div className='flex items-center gap-2 mb-4 '>
        <Link href="/admin/courses" className={buttonVariants({ variant: 'outline' })}>
        <ArrowLeft />
        </Link>
        <h1 className='text-2xl font-bold'>Create Course</h1>
    </div>

    <Card>
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>Basic Information</CardTitle>
            <CardDescription>
                Fill in the details below to create a new course.
            </CardDescription>
        </CardHeader>
        <CardContent>
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

                    <Button type="submit" className='mt-1'  onClick={
                        () => {
                            const slug = form.getValues('title').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                            form.setValue('slug', slug);
                        }
                    }> 
                        Generate Slug 
                        <SparkleIcon className='ml-2' />
                    </Button>
                     </div>

                    <FormField control={form.control} name="smalldescription" 
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

                    <Button type="submit" className='mt-4' disabled={!form.formState.isValid}>
                        Create Course
                        <PlusIcon className='ml-2' />
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
    </>
  )
}
