import { Link, usePage } from "@inertiajs/react"
import Button from "@shared/components/Button"
import SectionTitle from "@shared/components/SectionTitle"
import { useState } from "react"
import DashboardToggleLink from "./DashboardToggleLink"


type DashboardLayoutInterface = {
  dashboardSideBarTitle: string,
  dashboardSideBarLinks: [
    {
      text: string,
      link?: string,
      links?: [
        {
          text: string,
          link: string
        }
      ],
      active: string
    }
  ]
}
const DashboardSideBar = ({ data }: { data: any }) => {
  const { dashboardSideBarLinks, dashboardSideBarTitle }: DashboardLayoutInterface = data
  const { url } = usePage<any>()
  const [open, setOpen] = useState(false);
  const { locale } = usePage().props

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        clickFunction={() => setOpen(!open)}
        className={`lg:hidden cursor-pointer fixed  top-32 left-1/2  -translate-x-1/2 z-50  shadow-md ${open && "opacity-0!"} `}
      >
        {locale == "en" ? "Control Panel" : "لوحة التحكم"}
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    pt-32
    lg:sticky
    lg:top-0
    lg:h-[calc(100vh)]
    lg:overflow-y-auto
    lg:w-64
    lg:shrink-0
    max-lg:fixed
    max-lg:top-0
    max-lg:start-0
    max-lg:h-[calc(100vh)]
    max-lg:w-64
    max-lg:overflow-y-auto
    max-lg:z-50
    bg-gradient-to-b 
    from-arch-gray/95 
    via-gray-200 
    to-arch-gray/95
    text-light
    flex
    flex-col
    p-6
    shadow-lg
    transform
    transition-transform
    duration-300
    ${open
            ? 'max-lg:translate-x-0'
            : 'max-lg:-translate-x-full max-lg:rtl:translate-x-full'}
  `}
      >
        {/* Sidebar Header */}
        <SectionTitle className="text-2xl font-bold mb-8 border-b border-arch-light pb-2 text-arch-dark">
          {dashboardSideBarTitle}
        </SectionTitle>

        {/* Links */}
        <ul className="flex flex-col gap-3">
          {dashboardSideBarLinks.map((btn, i: number) => (
            btn.link ?
              <Link
                key={i}
                href={btn.link}
                className={`px-4 py-2 rounded-lg hover:text-arch-charcoal transition-colors font-medium text-light text-lg text-arch-dark`}
                onClick={() => setOpen(false)}
              >
                {btn.text}
              </Link>
              :
              <DashboardToggleLink
                key={i}
                btn={btn}
              />
          ))}
        </ul>
      </aside>
    </>
  )
}

export default DashboardSideBar