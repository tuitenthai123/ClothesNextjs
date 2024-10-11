import React from 'react'
import { db } from '@/lib/db'
import { DataTable } from './_component/datatable'
import {columns} from "./_component/columns"

const page = async () => {
  const userdata = await db.user.findMany();
  return (
    <div >
    <div className="p-6 -mt-6">
      <DataTable columns={columns} data={userdata} />
    </div>
  </div>
  )
}

export default page