import { ReactNode } from "react"

const MainTitle = ({ children, className, white, black, hero, center }: { center?: boolean, hero?: boolean, white?: boolean, black?: boolean, className?: string, children: ReactNode }) => {
  return (
    <h1 className=
      {`
      font-bold
      ${white ? "text-arch-card" : black && "text-arch-dark"}
      ${hero ? "text-4xl leading-3" : "text-3xl leading-2"}
      ${center && "text-center"}
    ${className}
    `}
    >
      {children}
    </h1>
  )
}

export default MainTitle
