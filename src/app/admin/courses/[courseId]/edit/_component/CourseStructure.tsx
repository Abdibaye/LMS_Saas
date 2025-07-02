"use client"

import {DndContext, rectIntersection} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function CourseStructure() {
    const [items] = useState(['1', '2', '3']);

  return (
    <DndContext collisionDetection={rectIntersection}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
          <CardTitle>Chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext strategy={verticalListSortingStrategy} items={items} >

          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  )
} 
