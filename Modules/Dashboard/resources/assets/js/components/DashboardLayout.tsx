import { Head, usePage } from "@inertiajs/react"
import { createContext, ReactNode, useState } from "react"
import DashboardSideBar from "./DashboardSideBar"
import DeletePopUp from "./DeletePopUp"


type DeleteState = {
  message: string
  url: string
  returnedUrl: string
}

type DeleteContextType = {
  deleteState: DeleteState | null
  setDeleteState: React.Dispatch<React.SetStateAction<DeleteState | null>>
}

export const DeleteContext = createContext<DeleteContextType | null>(null)

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { globalData } = usePage().props

  const [deleteState, setDeleteState] = useState<DeleteState | null>(null)

  return (
    <DeleteContext.Provider value={{ deleteState, setDeleteState }}>
      <div className="w-full min-h-screen flex justify-end items-start  ">
        <Head title="Dashboard" />
        {
          deleteState != null &&
          <DeletePopUp />
        }
        <DashboardSideBar data={globalData} />
        <div className="w-[calc(100%-16rem)] max-lg:w-full">
          {children}
        </div>
      </div>
    </DeleteContext.Provider>
  )
}

export default DashboardLayout