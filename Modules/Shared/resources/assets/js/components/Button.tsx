import { ReactNode } from "react"
import Image from "./Image"

const Button = (
  { disable,
    className,
    children,
    clickFunction,
    icon,
    transparent,
    border,
    black,
    dontAddPadding,
    dontAddHoverEffect,
    dontAddShadow
  }:
    {
      dontAddShadow?: boolean,
      dontAddHoverEffect?: boolean,
      disable?: boolean,
      icon?: string,
      className?: string,
      children: ReactNode,
      clickFunction?: () => void,
      transparent?: boolean,
      border?: boolean,
      black?: boolean,
      dontAddPadding?: boolean
    }
) => {
  return (
    <button
      disabled={disable}
      className=
      {`
        ${!dontAddHoverEffect && "hover:scale-105"}
        ${!dontAddShadow && "shadow-md"}
        text-[18px]
        font-semibold
        cursor-pointer
        duration-300
        active:scale-90
        disabled:opacity-60 disabled:cursor-not-allowed
      flex items-center justify-center 
      rounded-md
      ${!dontAddPadding && "px-5 py-2"}
      ${black ? "text-arch-dark" : "text-arch-light"}
      ${border && "border-1 border-arch-accent"}
      ${icon && "gap-2"}
      ${transparent ? "bg-transparent" : "bg-arch-accent"}
      ${className || ""}
    `}
      onClick={clickFunction}>
      {children}
      {icon && <Image className="w-5 shrink-0 object-contain icon" src={icon} />}
    </button>
  )
}

export default Button
