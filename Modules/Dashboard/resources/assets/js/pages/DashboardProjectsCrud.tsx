import DashboardLayout from "@dashboard/components/DashboardLayout"
import DynamicForm from "@dashboard/components/DynamicForm"


const DashboardProjectsCrud = ({ allData }: { allData: any }) => {
  const { isEdit, content, project }: { isEdit?: boolean, content: any, project: any } = allData
  console.log(project)
  return (
    <DashboardLayout>
      <div className='max-lg:pt-20 py-6 px-5'>
        <DynamicForm
          deleteUrl={isEdit ? (content.submitUrl + "/" + project.id) : undefined}
          initialData={isEdit ? project : undefined}
          fields={content.inputs}
          submitUrl={isEdit ? content.submitUrl + '/' + project.id : content.submitUrl}
          returnUrl={"/dashboard/projects/services"}
          itemName={content.itemName}
          isEdit={isEdit}
        />
      </div>
    </DashboardLayout>
  )
}

export default DashboardProjectsCrud
