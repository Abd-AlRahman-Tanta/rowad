import { ReactNode } from "react"

const Description = ({ children, className }: { className?: string, children: ReactNode }) => {
  return (
    <p className={`${className}`} dangerouslySetInnerHTML={{ __html: children as string }} />
  )
}

export default Description
