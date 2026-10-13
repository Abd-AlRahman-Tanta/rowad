import { router, usePage } from "@inertiajs/react"
import { useContext, useState } from "react"
import { DeleteContext } from "./DashboardLayout"
import axios from "axios"
import { toast } from "sonner"

const DeletePopUp = () => {
  const ctx = useContext(DeleteContext)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { locale } = usePage().props
  if (!ctx) return null

  const close = () => {
    ctx.setDeleteState(null)
    setErrorMessage(null)
  }

  const handleDelete = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      await axios.delete(`${ctx.deleteState?.url}` || "")
      close()
      toast.success(locale == "en" ? "Deleted successfully." : "تم الحذف بنجاح.")
      router.visit(`${ctx.deleteState?.returnedUrl}` || "")
    } catch (error: any) {
      if (error.response?.status === 422) {
        toast.error(error.response.data.message)
        setErrorMessage(error.response.data.message)
      } else {
        const fallbackMsg = locale == "en"
          ? "Something went wrong. Please try again."
          : "حدث خطأ ما. حاول مرة أخرى."
        toast.error(fallbackMsg)
        setErrorMessage(fallbackMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
        <p className="text-gray-800 text-lg mb-6">
          {ctx.deleteState?.message}
        </p>
        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={close}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            {locale == "en" ? "Cancel" : "الغاء"}
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-500 text-white disabled:opacity-50"
          >
            {
              loading ?
                (locale == "en" ? "Deleting..." : "جاري الحذف....")
                :
                (locale == "en" ? "Confirm" : "تأكيد")
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletePopUp