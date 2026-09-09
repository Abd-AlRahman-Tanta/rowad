import { BlogProps } from "@blogs/interfaces";
import DashboardLayout from "@dashboard/components/DashboardLayout";
import DynamicForm from "@dashboard/components/DynamicForm";

const DashboardBlogsCrud = ({ allData }: { allData: any }) => {
  const { isEdit, content, blog }: { isEdit?: boolean; content: any; blog: BlogProps } = allData

  const initialData = isEdit && blog
    ? {
      ...blog,
      published: [{ val: blog.published ? "1" : "0" }]
    }
    : undefined

  return (
    <DashboardLayout>
      <div className="max-lg:pt-48  pt-32 px-5">
        <DynamicForm
          deleteUrl={isEdit ? content.submitUrl + '/' + blog.id : undefined}
          initialData={initialData}
          fields={content.inputs}
          submitUrl={isEdit ? content.submitUrl + '/' + blog.id : content.submitUrl}
          returnUrl={content.submitUrl}
          itemName={content.itemName}
          isEdit={isEdit}
        />
      </div>
    </DashboardLayout>
  )
}

export default DashboardBlogsCrud