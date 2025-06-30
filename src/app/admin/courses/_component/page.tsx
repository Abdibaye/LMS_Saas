import { adminCourseType } from "@/app/data/admin/admin-get-course";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useContructUrl } from "@/hooks/use-contruct-url";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface courseType {
    data: adminCourseType;
}

export default function AdminCourseCard({data}: courseType) {

    const thumbnail = useContructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0"> 

    <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="secondary" size="icon">
                    <MoreVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                    <Link href={`/admin/courses/${data.id}/edit`} className="flex gap-4">
                    <Pencil />
                    Edit course
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/admin/courses/${data.id}/edit`} className="flex gap-4">
                    <Eye />
                    Preview 
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Link href={`admin/course/${data.id}/delete`} className="flex gap-4">
                    <Trash2 className="text-destructive" />
                    Delete Course 
                    </Link>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>

        <div>
            <Image src={thumbnail} alt="thumbnail url" width={600} height={400}
             className="w-full rounded-t-lg aspect-video h-full object-cover" />
        </div>

        <CardContent className="p-4" >
            <Link href={`/admin/course/${data.id}/edit`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">
                {data.title}
            </Link>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{data.smallDescription}</p>
            <div className="mt-4 flex items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                    <p className="text-sm text-muted-foreground">{data.duration}h</p>
                </div>
                    <div className="flex items-center gap-x-2">
                    <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                    <p className="text-sm text-muted-foreground">{data.level}</p>
                </div>
            </div>
            <Link className={buttonVariants({
                className:'w-full mt-4'
            })} href={`/admin/courses/${data.id}/edit`}>
            <ArrowRight className="size-4" />
            Edit Course
            </Link>
        </CardContent>
        
    </Card>
  ) 
}

