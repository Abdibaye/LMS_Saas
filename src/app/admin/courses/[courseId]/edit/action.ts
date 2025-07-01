"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zod.Schema";

export async function editCourse(data: CourseSchemaType,coursId: string): Promise<ApiResponse> {
    const user = await requireAdmin();
    
    try{
        const result = courseSchema.safeParse(data);
        if(!result.success){
            return {
                status:"error",
                message:"invalid data"
            }
        }

        await prisma.course.update({
            where:{
                id: coursId,
                userId: user.user.id
            },
            data:{
                ...data
            }
        })

        return {
            status:"success",
            message:"Course Updated succefully"
        }
    } catch {
        return {
            status: 'error',
            message: "Faild to update course"
        }
    }
}