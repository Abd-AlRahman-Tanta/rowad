import { Head, Link, router, usePage } from "@inertiajs/react"
import Footer from "@shared/components/Footer"
import NavBar from "@shared/components/NavBar"
import SuccessNotification from "@shared/components/SuccessNotification"
import { FooterProps, NavBarProps } from "@shared/Types"
import EditorModal from "@shared/utils/EditorModal"
import PageContentProvider from "@shared/utils/PageContentProvider"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
export const Notify = createContext<{ message: string | null, setMessage: Dispatch<SetStateAction<string | null>> } | null>(null)

export type AnimVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "zoom"
  | "blur"

export type GetAnimOptions = {
  delay?: number
  duration?: number
  easing?: "out" | "in" | "inOut" | "linear"
  variant?: AnimVariant
  once?: boolean
}

export type AnimProps = {
  className: string
  style: React.CSSProperties
}

export const Animations = createContext<{
  getAnimClass: (inView: boolean, opts?: GetAnimOptions) => string
  animProps: (inView: boolean, opts?: GetAnimOptions) => AnimProps
} | null>(null)

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null)
  const { globalData, locale, auth } = usePage<any>().props
  const { url } = usePage()
  const isDashboard = () => url.includes("/dashboard")

  const getAnimClass = (inView: boolean, opts: GetAnimOptions = {}) => {
    const {
      easing = "out",
      variant = "fadeUp",
    } = opts

    const easeClass =
      easing === "in" ? "ease-in" : easing === "inOut" ? "ease-in-out" : easing === "linear" ? "ease-linear" : "ease-out"

    const base = `transition-all ${easeClass} will-change-transform will-change-opacity`

    if (variant === "fadeUp") {
      return `${inView ? "viewEndEffect" : "viewStartEffect"} ${base}`
    }

    const startOverride =
      variant === "fadeDown" ? "opacity-0 translate-y-10"
        : variant === "fadeLeft" ? "opacity-0 translate-x-10"
          : variant === "fadeRight" ? "opacity-0 -translate-x-10"
            : variant === "zoom" ? "opacity-0 scale-[0.98]"
              : variant === "blur" ? "opacity-0 blur-sm"
                : ""

    const endOverride =
      variant === "fadeDown" || variant === "fadeLeft" || variant === "fadeRight" ? "opacity-100 translate-x-0 translate-y-0"
        : variant === "zoom" ? "opacity-100 scale-100"
          : variant === "blur" ? "opacity-100 blur-0"
            : ""

    return `${inView ? endOverride : startOverride} ${base}`
  }

  const animProps = (inView: boolean, opts: GetAnimOptions = {}): AnimProps => {
    const { delay = 0, duration = 700 } = opts
    return {
      className: `a-props ${getAnimClass(inView, opts)}`,
      style: {
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }
    }
  }

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
      <Animations.Provider value={{ getAnimClass, animProps }}>
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
      </Animations.Provider>
    </Notify.Provider>
  )
}

export default ProjectLayout
