import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { SectionCards } from '@/components/sidebar/section-cards'
import React from 'react'



import data from "./data.json"
import { DataTable } from '@/components/sidebar/data-table'

export default function AdminIndexPage() {
  return (
    <>

    <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
     <DataTable data={data} />
    
    </>
  )
}
