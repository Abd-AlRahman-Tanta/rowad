import { NavBarProps } from "@shared/Types"
import { useState } from "react"
import Bars from "./Bars"
import Image from "./Image"
import NavBarLinks from "./NavBarLinks"
import NavBarLogoAndLanguageChanger from "./NavBarWhatsAppAndLanguageChanger"
import { Link } from "@inertiajs/react"
import EditableObject from "@shared/utils/EditableObject"

const NavBar = ({ mainLinks, navBarLang, navBarLogo, navBarWhatsApp }: NavBarProps) => {
  // Mobile menu open/close state
  const [list, setList] = useState(false);
  return (
    <>
      {/* Overlay (mobile) */}
      <div
        onClick={() => setList(false)}
        className={
          `fixed inset-0 z-[1150] bg-black/50   transition-opacity duration-300 ` +
          (list ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        aria-hidden="true"
      />

      <div className="max-w-[1920px] w-full fixed z-1100 top-0 left-1/2 -translate-x-1/2 pt-5 px-5  bg-transparent">
        <nav
          className={`    
            w-full h-20 flex justify-between items-center
            bg-gradient-to-r from-arch-gray/95 via-gray-200 to-arch-gray/95
            border-2 border-arch-accent
            rounded-xl
            px-5
            `}>

          <EditableObject
            start="60%"
            top="40%"
            path="navBarLogo"
            fields={navBarLogo}
          >
            <Link href={navBarLogo.link}>
              <Image className={` w-[4.5rem] block  object-contain `} src={navBarLogo.icon} />
            </Link>
          </EditableObject>

          <NavBarLinks
            className=
            {`flex justify-center items-center gap-4 max-desc:hidden`}
            mainLinks={mainLinks}
            navBarWhatsApp={navBarWhatsApp}
          />
          <div
            className="flex items-center gap-2"
          >
            <NavBarLogoAndLanguageChanger className="flex"
              navBarLang={navBarLang}
              navBarWhatsApp={navBarWhatsApp}
            />
            <Bars list={list} showList={setList} />
          </div>
        </nav>
      </div>
      <NavBarLinks
        closeList={setList}
        className=
        {`
          desc:hidden
          max-desc:block
          max-desc:py-[20vh]
          max-desc:bg-gradient-to-b 
          max-desc:from-arch-gray/95 
          max-desc:via-gray-200 
          max-desc:to-arch-gray/95
          max-desc:max-w-3xs
          max-desc:w-full
          max-desc:h-screen
          max-desc:fixed  
          max-desc:top-0
          max-desc:start-0
          max-desc:z-[1200]
          max-desc:overflow-auto
          ${list ? "max-desc:translate-x-0" : "max-desc:-translate-x-full rtl:translate-x-full"}
          max-desc:duration-300
        `}
        navBarLogo={navBarLogo}
        mainLinks={mainLinks}
        navBarWhatsApp={navBarWhatsApp}
      />
    </>
  )
}

export default NavBar
