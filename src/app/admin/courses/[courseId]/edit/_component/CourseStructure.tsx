'use client';

import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-cours';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight, FileText, Ghost, GripVertical, Trash2 } from 'lucide-react';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import Link from 'next/link';
import { toast } from 'sonner';

interface iAppProps {
  data:AdminCourseSingularType
}

interface SortableItemProps{
  id: string,
  children?: (listeners: DraggableSyntheticListeners) => ReactNode
  className?: string;
  data?: {
    type: 'chapter' | 'lesson'
    chapterId?: string;
  }
}

export default function CourseStructure({data}:iAppProps) {
  
  const initialItems = data.chapters.map((chapter) => ({
    id:chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen:true,
    lessons: chapter.lesson.map((lesson) => ({
      id:lesson.id,
      title:lesson.title,
      order:lesson.position
    }))
  })) || [];

  const [items, setItems] = useState(initialItems);

  function toggleChapter(chapterId:string){
    setItems(
      items.map((chapter) => chapter.id === chapterId ? {...chapter,isOpen:!chapter.isOpen} : chapter)
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if(!over || active.id === over.id){
      return;
    }

     const activeId = active.id;
     const overId = over.id;
     const activeType = active.data.current.type as 'chapter' | 'lesson';
     const overType = over.data.current.type as 'chapter' | 'lesson';
      const courseId = data.id;

      if(activeType == 'chapter'){
        let targetChapterId = null;

        if(overType == 'chapter'){
          targetChapterId = overId;
        } else if(overType === "lesson"){
          targetChapterId = over.data.current?.chapterId ?? null;
        }

        if(!targetChapterId){
          toast.error("Could not determine the chapter for reordering");
          return;
        }
        
        const oldIndex = items.findIndex((item) => item.id === activeId); 
        const newIndex = items.findIndex((item) => item.id === targetChapterId);

        if(oldIndex == -1 || newIndex === -1){
          toast.error("could not find chapter old/new index for reordering")

          return
        }

        const reordedLocalChapter = arrayMove(items,oldIndex, newIndex)

        const updatedChapterForState = reordedLocalChapter.map((chapter,index) => ({
          ...chapter,
          order: index + 1
        }))

        const previousItems = [...items]

        setItems(updatedChapterForState)
      }

      if(activeType === 'lesson' && overType === 'lesson'){
        const chapterId = active.data.current?.chapterId;
        const overChapterId = over.data.current?.chapterId;

        if(!chapterId || chapterId != overChapterId ){
          toast.error("Lesson move between difference chapter or invalide chapter ID is not allowed");
          return;
        }

        const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId);

        if(chapterIndex === -1){
          toast.error("Could not find chapter index for lesson");
          return
        }

        const chapterToUpdate = items[chapterIndex];

        const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId);


        const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id == overId);

        if(oldLessonIndex === -1 || newLessonIndex === -1){
          toast.error("Could not find lesson for reordering");
          return;
        }

        const reordedLessons = arrayMove(
          chapterToUpdate.lessons,
          oldLessonIndex,
          newLessonIndex
        );

        const updatedChapterForState = reordedLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1 
        }));

        const newItems = [...items];
        
        newItems[chapterIndex] = {
          ...chapterToUpdate,
          lessons: updatedChapterForState,
        };
         
        const previousItems = [...items]

        setItems(newItems)
      }
    }


  

  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 border rounded mb-2 shadow"
      > 
        {children && children(listeners)}
      </div>  
    );
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
          <CardTitle>Chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} data={{type: "chapter"}} >
                {(listeners) => (
                  <Card>
                    <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                    <div className='flex item-center justify-between p-3 border-b border-border'>
                      <div className='flex items-center gap-2'>
                        <button className='cursor-grap opacity-60 hover:opacity-100' {...listeners}>
                           <GripVertical className='size-4' />
                        </button>
                        <CollapsibleTrigger>
                        <Button variant={"ghost"} size={"icon"} >
                          {item.isOpen ? (
                            <ChevronDown className='size-4' /> 
                          ): <ChevronRight className='size-4' /> }
                        </Button>
                        </CollapsibleTrigger>
                        <p className='cursor-pointer hover:text-primary'>{item.title}</p>
                      </div>
                      <Button variant={"ghost"} size={"icon"} >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                    <CollapsibleContent>
                    <div className='p-1 '>
                      <SortableContext
                        items={item.lessons}
                        strategy={verticalListSortingStrategy}
                      >
                        {item.lessons.map((lesson) => (
                          <SortableItem key={lesson.id} id={lesson.id} data={{type: "lesson"}}>
                            {(listeners) => (
                              <div className="flex items-center justify-between gap-2 hover:bg-accent rounded-md">
                                <div className="flex items-center gap-2">
                                  <button className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                    <GripVertical className="size-4" />
                                  </button>
                                  <FileText className='size-4' />
                                  <Link href={`/admin/courses/${data.id}/edit/lessons/${lesson.id}`} className='text-sm text-muted-foreground hover:text-primary'>{lesson.title}</Link>
                                </div>
                                <Button variant={"ghost"} size={"icon"} >
                                  <Trash2 className='size-4' />
                                </Button>
                              </div>
                            )}
                          </SortableItem>
                        ))}
                      </SortableContext>
                      <Button
                        className="mt-1 w-full"
                        variant="outline"
                        size="sm"
                        // onClick={...} // Add your handler here
                      >
                        + Create New Lesson
                      </Button>
                    </div>
                    </CollapsibleContent>
                        </Collapsible>  
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
