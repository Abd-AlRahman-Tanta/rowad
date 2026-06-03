import { ReactNode } from "react"

const SectionTitle = ({ children, className }: { className?: string, children: ReactNode }) => {
  return (
    <h2 className={`${className}`}>
      {children}
    </h2>
  )
}

export default SectionTitle
