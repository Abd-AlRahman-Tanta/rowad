import { Head, Link, router, usePage } from "@inertiajs/react"
import Footer from "@shared/components/Footer"
import NavBar from "@shared/components/NavBar"
import SuccessNotification from "@shared/components/SuccessNotification"
import { FooterProps, NavBarProps } from "@shared/Types"
import EditorModal from "@shared/utils/EditorModal"
import PageContentProvider from "@shared/utils/PageContentProvider"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
export const Notify = createContext<{ message: string | null, setMessage: Dispatch<SetStateAction<string | null>> } | null>(null)

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null)
  const { globalData, locale, auth } = usePage<any>().props
  const { url } = usePage()
  const isDashboard = () => url.includes("/dashboard")
  // nav props
  const navProps: NavBarProps = {
    navBarLang: globalData.navBarLang,
    mainLinks: globalData.mainLinks,
    navBarLogo: globalData.navBarLogo,
    navBarWhatsApp: globalData.navBarWhatsApp
  }
  const footer: FooterProps = {
    contactInformations: globalData.contactInformations,
    contactTitle: globalData.contactTitle,
    footerLogo: globalData.footerLogo,
    footerRightsText: globalData.footerRightsText,
    footerSocialMediaLinks: globalData.footerSocialMediaLinks,
    siteMap: globalData.siteMap,
    siteMapTitle: globalData.siteMapTitle,
  }
  return (
    <Notify.Provider value={{ message, setMessage }}>
      <PageContentProvider pageName="Global">
        <div id="pageLayout" dir={locale == "ar" ? "rtl" : "ltr"}
          className={`max-w-[1920px] bg-gray-100  w-full font-family-main cursor-default select-none mx-auto overflow-x-clip`}>
          {message && <SuccessNotification message={message} setMessage={setMessage} />}
          <Head>
            <link rel="icon" type="image" href="/storage/images/logo.png" />
            <title>{globalData.headTitle}</title>
          </Head>
          <EditorModal />
          {
            auth && !isDashboard() &&
            <Link
              href={"/dashboard"}
              className="
                fixed bottom-6 left-6
                flex items-center gap-2
                px-5 py-3
                bg-gradient-to-r from-indigo-600 to-purple-600
              text-arch-light font-semibold
                rounded-full
                shadow-lg
                hover:shadow-xl
                hover:scale-105
                active:scale-95
                transition-all duration-200 cursor-pointer  
                z-50
                "
            >
              <span className="text-lg">🏠</span>
              Dashboard
            </Link>
          }
          <NavBar {...navProps} />
          {children}
          <Footer {...footer} />
        </div>
      </PageContentProvider>
    </Notify.Provider>
  )
}

export default ProjectLayout
