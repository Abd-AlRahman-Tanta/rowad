import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

type LinkItem = {
  text: string
  link: string
}

type Button = {
  text: string
  link?: string
  links?: LinkItem[]
  active: string
}

const DashboardToggleLink = ({ btn }: { btn: Button }) => {
  const [list, setList] = useState(false)

  return (
    <div
      onClick={() => setList(prev => !prev)}
      className={`
        cursor-pointer
        rounded-lg
        font-medium
        text-light
        text-lg
        
      `}
    >
      {/* Header */}
      <span className={`flex justify-between items-center w-full px-4 py-2 hover:bg-primary 
        rounded-lg duration-300`}>
        {btn.text}
        <IoIosArrowDown
          className={`
            duration-300
            ${list ? 'rotate-180' : ''}
          `}
        />
      </span>

      {/* Dropdown */}
      <div
        className={`
          grid
          duration-300
          ${list ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
        `}
      >
        <div className="overflow-hidden">
          {btn.links &&
            btn.links.map((lnk, i) => (
              <Link
                key={i}
                href={lnk.link}
                className="block px-4 py-2 mt-2  rounded-lg text-light bg-light/20"
              >
                {lnk.text}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardToggleLink