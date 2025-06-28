"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zod.Schema";
import { headers } from "next/headers";

export async function CreteCourse(values: CourseSchemaType): Promise<ApiResponse> {
    try{

        const session = await auth.api.getSession({
            headers: await headers()
        })

        const validation = courseSchema.safeParse(values)
        if(!validation.success){
            return{
                status: 'error',
                message: 'Invalid form data'
            }
        }
        
        const data = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
            
        });

        return {
            status: "success",
            message: "course created succesfully"
        }
    }catch(error){
        console.log(error)
        return {
            status: "error",
            message: "Invalid Form Data"
        }
    }
}  