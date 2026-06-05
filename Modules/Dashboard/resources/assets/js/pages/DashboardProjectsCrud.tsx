import DashboardLayout from "@dashboard/components/DashboardLayout"
import DynamicForm from "@dashboard/components/DynamicForm"
import { Project } from "@projects/interfaces"


const DashboardProjectsCrud = ({ allData }: { allData: any }) => {
  const { isEdit, content, project }: { isEdit?: boolean, content: any, project: Project } = allData
  return (
    <DashboardLayout>
      <div className='max-lg:pt-48 py-10 pt-32 px-5'>
        <DynamicForm
          deleteUrl={isEdit ? (content.submitUrl + "/" + project.id) : undefined}
          initialData={isEdit ? project : undefined}
          fields={content.inputs}
          submitUrl={isEdit ? content.submitUrl + '/' + project.id : content.submitUrl}
          returnUrl={content.submitUrl}
          itemName={content.itemName}
          isEdit={isEdit}
        />
      </div>
    </DashboardLayout>
  )
}

export default DashboardProjectsCrud
