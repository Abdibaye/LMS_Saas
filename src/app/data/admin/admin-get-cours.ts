import "server-only"
import { requireAdmin } from "./require-admin"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export async function adminGetCourse(id: string){
    await requireAdmin()

    const data = await prisma.course.findUnique({
        where: {
            id: id,
        },
        select: {
            id:true,
            title:true,
            fileKey:true,
            price:true,
            level:true,
            smallDescription:true,
            slug:true,
            category:true,
            description:true,
            status:true,
            duration:true,
            chapters: {
                select: {
                    id:true,
                    title:true,
                    position:true,
                    lesson: {
                         select: {
                            id:true,
                            title:true,
                            description:true,
                            thumbnailKey:true,
                            videoKey:true,
                            position:true
                         }
                    }
                }
            }
        }
    })

    if(!data){
        return notFound();
    }

    return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;