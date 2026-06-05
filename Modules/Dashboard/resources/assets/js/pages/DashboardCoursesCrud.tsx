import DashboardLayout from '@dashboard/components/DashboardLayout'
import DynamicForm from '@dashboard/components/DynamicForm'
import { CourseProps } from '@pages/interfaces'
import React from 'react'

const DashboardCoursesCrud = ({ allData }: { allData: any }) => {
  const { isEdit, content, course }: { isEdit?: boolean, content: any, course: CourseProps } = allData
  return (
    <DashboardLayout>
      <div className='max-lg:pt-48 py-10 pt-32 px-5'>
        <DynamicForm
          deleteUrl={isEdit ? (content.submitUrl + "/" + course.id) : undefined}
          initialData={isEdit ? course : undefined}
          fields={content.inputs}
          submitUrl={isEdit ? content.submitUrl + '/' + course.id : content.submitUrl}
          returnUrl={content.submitUrl}
          itemName={content.itemName}
          isEdit={isEdit}
        />
      </div>
    </DashboardLayout>
  )
}

export default DashboardCoursesCrud
