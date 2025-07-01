import { adminGetCourse } from '@/app/data/admin/admin-get-cours'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonStanding } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import EditCourseForm from './_component/EditCourseForm';
import { useContructUrl } from '@/hooks/use-contruct-url';
import CourseStructure from './_component/CourseStructure';

type Params = Promise<{courseId:string}>

export default async function EditRoute({params}: {params: Params} ) {
    const { courseId } = await params;
    const data = await adminGetCourse(courseId)
  return (
    <div> 
       <h1 className='text-3xl font-bold mb-8'>
        Edit Course: <span className='text-primary'>{data.title }</span>
       </h1>
       <Tabs defaultValue='' className='w-full'>
        <TabsList className='grid grid-cols-2 w-full'>
          <TabsTrigger value='basic-info'>
            Basic info
          </TabsTrigger>
          <TabsTrigger value='course-structure'>
           Course Structure
          </TabsTrigger>
        </TabsList>
        <TabsContent value='basic-info'>
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>Edit basic info about the course</CardDescription>
            </CardHeader> 
            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='course-structure'>
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Here you can update your course structure</CardDescription>
            </CardHeader> 
            <CardContent>
              <CourseStructure />
            </CardContent>
          </Card>
        </TabsContent>
       </Tabs>
    </div>
  )
}
