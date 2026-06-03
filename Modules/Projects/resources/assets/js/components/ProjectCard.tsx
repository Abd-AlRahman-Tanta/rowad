import { Project } from '@projects/interfaces'
import Description from '@shared/components/Description'
import Image from '@shared/components/Image'
import Label from '@shared/components/Label'
import Layer from '@shared/components/Layer'
import SectionTitle from '@shared/components/SectionTitle'
import React, { Dispatch, SetStateAction } from 'react'
import { BiRightTopArrowCircle } from "react-icons/bi";

const ProjectCard = ({ description, images, name, created_at, isActive, onCLick }: Project & { isActive?: boolean, onCLick?: Dispatch<SetStateAction<Project | null>> }) => {
  const project = {
    name,
    description,
    images,
    created_at,
  }
  return (
    <div onClick={() => onCLick && onCLick({ ...project })} className={`group relative rounded-lg overflow-hidden  
      ${isActive
        ? "scale-100  "
        : "scale-90"} cursor-pointer duration-300   `}>
      <Image
        src={images[0].image}
        className='w-full h-[28rem] max-mob:h-[22rem] object-cover group-hover:scale-105 duration-500 '
      />
      <Layer
        className='bg-gradient-to-t from-black/90 via-black/20 to-transparent top-0 left-0 w-full h-full'
      />
      <div className='absolute bottom-4 start-3 z-10 max-w-[calc(100%-0.75rem)] '>
        <div
          className='text-yellow-500 text-sm'
          children={created_at}
        />
        <SectionTitle
          className='text-arch-light text-xl leading-3 font-bold'
          children={name}
        />
        {/* <Description
          children={description}
          className='text-arch-light/90 leading-3 text-sm '
        /> */}
      </div>
    </div>
  )
}

export default ProjectCard
