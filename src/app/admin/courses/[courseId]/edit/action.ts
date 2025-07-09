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

export async function reorderLessons(
  chapterId: string,
  lessonOrder: { id: string; order: number }[]
): Promise<ApiResponse> {
  const user = await requireAdmin();
  try {
    // Get the chapter and ensure it belongs to a course owned by the user
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true },
    });
    if (!chapter || chapter.course.userId !== user.user.id) {
      return { status: 'error', message: 'Unauthorized or chapter not found' };
    }

    // Update all lessons in parallel
    await Promise.all(
      lessonOrder.map(({ id, order }) =>
        prisma.lesson.update({
          where: { id },
          data: { position: order },
        })
      )
    );

    return { status: 'success', message: 'Lesson order updated' };
  } catch (err) {
    return { status: 'error', message: 'Failed to update lesson order' };
  }
}  

export async function reorderChapters(
  courseId: string,
  chapterOrder: { id: string; order: number }[]
): Promise<ApiResponse> {
  const user = await requireAdmin();
  try {
    // Get the course and ensure it belongs to the user
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course || course.userId !== user.user.id) {
      return { status: 'error', message: 'Unauthorized or course not found' };
    }

    // Update all chapters in parallel
    await Promise.all(
      chapterOrder.map(({ id, order }) =>
        prisma.chapter.update({
          where: { id },
          data: { position: order },
        })
      )
    );

    return { status: 'success', message: 'Chapter order updated' };
  } catch (err) {
    return { status: 'error', message: 'Failed to update chapter order' };
  }
}  
