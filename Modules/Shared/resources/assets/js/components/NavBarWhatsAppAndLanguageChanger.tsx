import { Link } from "@inertiajs/react"
import LanguageChanger from "./LanguageChanger"
import EditableObject from "@shared/utils/EditableObject"
import Button from "./Button"
import { NavBarLangProps, NavBarWhatsAppProps } from "@shared/Types"
import { ImWhatsapp } from "react-icons/im";
const NavBarWhatsAppAndLanguageChanger = (
  {
    className,
    navBarLang,
    navBarWhatsApp
  }:
    {
      navBarLang: NavBarLangProps,
      navBarWhatsApp: NavBarWhatsAppProps,
      className?: string
    }
) => {
  return (
    <div className={`flex items-center gap-5 text-arch-dark `}>
      <LanguageChanger navBarLang={navBarLang} />

      <EditableObject
        start="40%"
        top="40%"
        className="max-mob:hidden"
        path="navBarWhatsApp"
        fields={navBarWhatsApp}
      >
        <a className="flex items-center gap-1 px-4 py-2 " target="_blank" href={navBarWhatsApp.link} rel="noreferrer">
          <Button
            transparent
            black
            dontAddShadow
            dontAddHoverEffect
            dontAddPadding
            children={navBarWhatsApp.text}
          />
          <ImWhatsapp className="text-[18px]" />
        </a>
      </EditableObject>
    </div>
  )
}

export default NavBarWhatsAppAndLanguageChanger
