// import { Link, usePage } from "@inertiajs/react";
// import EditableText from "@shared/utils/EditableText";
// import { MdLanguage } from "react-icons/md";
// import Image from "./Image";
// import EditableObject from "@shared/utils/EditableObject";
// import { NavBarLangProps } from "@shared/Types";
// const LanguageChanger = ({ className, navBarLang }: { className?: string, navBarLang: NavBarLangProps }) => {
//   const { url, props: { locale } } = usePage();

//   return (
//     <EditableText start="90%" top="40%" path="navBarLang.text" text={navBarLang.text} >
//       <Link
//         href={
//           locale === "en"
//             ? `/ar${url}`
//             : `/en${url.slice(3)}`
//         }
//         className={` ${className} flex justify-center items-center gap-1 text-l `} >
//         {navBarLang.text}

//       </Link>
//     </EditableText>
//   )
// }

// export default LanguageChanger
import { Link, usePage } from "@inertiajs/react";
import { MdOutlineLanguage } from "react-icons/md";
import EditableObject from "@shared/utils/EditableObject";
import { NavBarLangProps } from "@shared/Types";
import { useEffect, useRef, useState } from "react";

const LanguageChanger = ({
  className,
  navBarLang,
}: {
  className?: string;
  navBarLang: NavBarLangProps;
}) => {
  const {
    props: { locale },
  } = usePage();


  const { pathname, search, hash } = window.location;

  const noPublic = pathname.replace(/^\/public/, "");
  const cleanPath = noPublic.replace(/^\/(en|ar)/, "");

  const finalPath = `${cleanPath || "/"}${search}${hash}`;

  const newUrl =
    locale === "en"
      ? `/ar${finalPath}`
      : `/en${finalPath}`;
  return (
    <EditableObject dontAddInputsFor={["icon"]} top="40%" path="navBarLang" fields={navBarLang}>
      <Link
        href={newUrl || ""}
        className={`${className} flex justify-center items-center gap-1 text-l overflow-hidden`}
      >
        <span className="leading-27  ">
          {navBarLang.text}
        </span>
        <MdOutlineLanguage className="text-[18px]" />
      </Link>
    </EditableObject>
  );
};

export default LanguageChanger;