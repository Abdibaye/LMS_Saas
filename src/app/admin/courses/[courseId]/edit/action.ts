"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { chapterSchema, chapterSchemaType, courseSchema, CourseSchemaType, lessonSchema } from "@/lib/zod.Schema";
import { revalidatePath } from "next/cache";

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

export async function createChapter(values: chapterSchemaType):Promise<ApiResponse> {
  await requireAdmin();
  try{

    const result = chapterSchema.safeParse(values);

    if(!result.success){
      return{
        status:"error",
        message:"invalid data"
      }
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        }
      });
      
      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        }
      })

      revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    });
    return {
      status: 'success',
      message: 'Chapter created successfully'
    };
  } catch {
    return {
      status: 'error',
      message: "Failed to create chapter"
    }
  }

  
}

export async function createLesson(values: chapterSchemaType):Promise<ApiResponse> {
  await requireAdmin();
  try{

    const result = lessonSchema.safeParse(values);

    if(!result.success){
      return{
        status:"error",
        message:"invalid data"
      }
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        }
      });
      
      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        }
      })

      revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    });
    return {
      status: 'success',
      message: 'Lesson created successfully'
    };
  } catch {
    return {
      status: 'error',
      message: "Failed to create Lesson"
    }
  }

  
}

export async function deleteLesson({chapterId,courseId,lessonId}:{chapterId:string, courseId:string,lessonId:string}):Promise<ApiResponse> {
  await requireAdmin()
  try{
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id:chapterId,
      },
      select: {
        lesson: {
          orderBy:{
            position:'asc'
          },
          select:{
            id:true,
            position:true
          }
        }
      }
    });

    if(!chapterWithLessons){
      return{
        status:"error",
        message:"chapter not found"
      }
    }

    const lesson =  chapterWithLessons.lesson

    const lessonToDelete = lesson.find((lesson) => lesson.id === lessonId);

    if(!lessonToDelete){
      return{
        status:"error",
        message:"messege not in chapter"
      }
    }

    const remainingLessons = lesson.filter((lesson) => lesson.id !== lessonId)

    const update = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 }
      }) 
    });

    await prisma.$transaction([
      ...update,
      prisma.lesson.delete({
        where: {
          id:lessonId,
          chapterId:chapterId,

        }
      })

    ])

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status:"success",
      message:"lesson deleted and position reordered successfully"
    }
  }catch{
    return{
      status:"error",
      message:"Failed to delete lesson"
    }
  }
}

export async function deleteChapter({chapterId,courseId}:{chapterId:string, courseId:string}):Promise<ApiResponse> {
  await requireAdmin()
  try{
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id:courseId,
      },
      select: {
        chapters: {
          orderBy:{
            position:'asc'
          },
          select:{
            id:true,
            position:true
          }
        }
      }
    });

    if(!courseWithChapters){
      return{   
        status:"error",
        message:"course not found"
      }
    }

    const chapters =  courseWithChapters.chapters

    const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId);

    if(!chapterToDelete){
      return{
        status:"error",
        message:"chapter not found in course"
      }
    }

    const remainingChapters = chapters.filter((ch) => ch.id !== chapterId)

    const update = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 }
      }) 
    });

    await prisma.$transaction([
      ...update,
      prisma.chapter.delete({
        where: {
          id:chapterId,
        }
      })

    ])

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status:"success",
      message:"chapter deleted and position reordered successfully"
    }
  }catch{
    return{
      status:"error",
      message:"Failed to delete chapter"
    }
  }
}
