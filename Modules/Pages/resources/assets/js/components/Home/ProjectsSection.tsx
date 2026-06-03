import { ProjectsSectionProps } from '@pages/interfaces'
import Label from '@shared/components/Label'
import MainTitle from '@shared/components/MainTitle'
import EditableText from '@shared/utils/EditableText'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import "swiper/css/navigation";
import ProjectCard from '@projects/components/ProjectCard'
import { Project } from '@projects/interfaces'
import ProjectPopup from '@projects/components/ProjectPopup'
const ProjectsSection = ({ projects, projectsDescription, projectsLabel, projectsTitle }: ProjectsSectionProps) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  return (
    <div id='projects' className="w-full py-20 scroll-m-20">
      <div className='w-full px-largeSaveSpace max-desc:px-mobSaveSpace mb-16'>
        <Label className='mx-auto' path='projectsLabel' title={projectsLabel} />
        <EditableText
          top='50%'
          path='projectsTitle'
          text={projectsTitle}
          className='w-fit mx-auto'
        >
          <MainTitle
            center
            children={projectsTitle}
            black
          />
        </EditableText>
        <EditableText
          richtext
          text={projectsDescription}
          path='projectsDescription'
          children={projectsDescription}
          className='text-arch-gray w-fit my-4 text-lg leading-4  text-center '
        />
      </div>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1.5}
        centeredSlides={true}
        spaceBetween={0}
        initialSlide={2}
        speed={900}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          768: {
            slidesPerView: 2.5,
          },
          992: {
            slidesPerView: 3.5,
          },
        }}
        className="projects-swiper  "
      >
        {
          projects.map((project, index) => (
            <SwiperSlide key={index}>
              {
                ({ isActive }) => (
                  <ProjectCard
                    onCLick={setActiveProject}
                    {...project}
                    isActive={isActive}
                  />
                )
              }
            </SwiperSlide>
          ))
        }
      </Swiper>
      {activeProject && (
        <ProjectPopup
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  )
}

export default ProjectsSection
