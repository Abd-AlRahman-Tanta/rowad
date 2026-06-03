import { ReactNode } from "react"

const Image = ({ src, className }: { className?: string, src: ReactNode | string }) => {
  return (
    <img loading="lazy" src={typeof src == "string" ? src : ""} className={`${className}`}>

    </img>
  )
}

export default Image
