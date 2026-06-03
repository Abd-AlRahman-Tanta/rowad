import { ReactNode } from "react"

const Description = ({ children, className }: { className?: string, children: ReactNode }) => {
  return (
    <p className={`${className}`}>
      {children}
    </p>
  )
}

export default Description
