"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zod.Schema";
import { headers } from "next/headers";

export async function CreteCourse(values: CourseSchemaType): Promise<ApiResponse> {
    try{
        console.log('Starting course creation with values:', values);
        
        const session = await auth.api.getSession({
            headers: await headers()
        })

        console.log('Session:', session);

        if (!session?.user?.id) {
            console.log('No session or user ID found');
            return {
                status: 'error',
                message: 'Authentication required'
            }
        }

        const validation = courseSchema.safeParse(values)
        if(!validation.success){
            console.error('Validation error:', validation.error)
            return{
                status: 'error',
                message: 'Invalid form data: ' + validation.error.errors.map(e => e.message).join(', ')
            }
        }
        
        console.log('Validation successful, data:', validation.data);
        
        // Transform data to match Prisma schema
        const courseData = {
            title: validation.data.title,
            description: validation.data.description,
            category: validation.data.category,
            smallDescription: validation.data.smallDescription,
            slug: validation.data.slug,
            fileKey: validation.data.fileKey,
            level: validation.data.level,
            price: parseFloat(validation.data.price.toString()),
            duration: parseFloat(validation.data.duration.toString()),
            status: validation.data.status,
            userId: session.user.id,
        };

        console.log('Course data to be created:', courseData);

        const data = await prisma.course.create({
            data: courseData,
        });

        console.log('Course created successfully:', data);

        return {
            status: "success",
            message: "Course created successfully"
        }
    }catch(error){
        console.error('Course creation error:', error)
        
        // Handle specific Prisma errors
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return {
                    status: "error",
                    message: "A course with this slug already exists"
                }
            }
            if (error.message.includes('Foreign key constraint')) {
                return {
                    status: "error", 
                    message: "User not found"
                }
            }
        }
        
        return {
            status: "error",
            message: "Failed to create course. Please try again."
        }
    }
}  