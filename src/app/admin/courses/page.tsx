import { adminGetCourses } from '@/app/data/admin/admin-get-course'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import AdminCourseCard from './_component/page';

export default async function CoursesPage() {
  const data = await adminGetCourses();
  return (
    <>
    <div className='flex justify-between items-center'>
      <h1 className='text-2xl font-bold'>Your Courses</h1>
      <Link href={'/admin/courses/create'} className={buttonVariants()}>
        Create Course
      </Link>
    </div>
   <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4'>
    {data.map((course) => (
      <AdminCourseCard key={course.id} data={course} />
    ))}
  </div>
    </>
  )
}
