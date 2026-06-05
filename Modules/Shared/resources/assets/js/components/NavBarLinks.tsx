import { Link, router, usePage } from "@inertiajs/react"
import { Dispatch, SetStateAction } from "react"
import EditableText from "@shared/utils/EditableText"
import EditableObject from "@shared/utils/EditableObject"
import Button from "./Button"
import Image from "./Image"
import { MainLinkProps, NavBarWhatsAppProps } from "@shared/Types"
import { ImWhatsapp } from "react-icons/im";
const NavBarLinks = ({ mainLinks, navBarWhatsApp, className, closeList, navBarLogo }:
  {
    mainLinks: MainLinkProps[],
    navBarWhatsApp: NavBarWhatsAppProps,
    className?: string,
    closeList?: Dispatch<SetStateAction<boolean>>,
    navBarLogo?: { icon: string, link: string }
  }
) => {
  const { component } = usePage()
  const scrollToSection = (id: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    localStorage.setItem("scrollToSection", id);
    router.visit("/");
  }

  return (
    <ul onClick={() => closeList && closeList(false)} className={`  ${className} `}>
      {
        navBarLogo &&
        <EditableObject
          top="40%"
          start="50%"
          path="navBarLogo"
          fields={navBarLogo}
        >
          <Link href={navBarLogo.link}>
            <Image className={` w-[4.5rem] block  object-contain mb-10 mx-auto `} src={navBarLogo.icon} />
          </Link>
        </EditableObject>
      }
      {
        mainLinks.map((navBarLink, i) => (
          <a
            onClick={(e) => component != "Home" && scrollToSection(navBarLink.id, e)}
            key={i} href={navBarLink.id}
            className=
            {`
              underline-offset-8
              hover:underline
              text-arch-dark
              duration-300
              max-desc:block 
              max-desc:mx-auto 
              max-desc:w-fit
              max-desc:my-4
              `} >
            <EditableText start="80%" text={navBarLink.text} path={`mainLinks.${i}.text`} children={navBarLink.text} />
          </a>
        ))
      }


      <EditableObject
        start="40%"
        top="40%"
        className="max-mob:block hidden w-fit mx-auto"
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
    </ul>
  )
}

export default NavBarLinks
