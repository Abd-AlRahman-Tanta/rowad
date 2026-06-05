import { ProjectsSectionProps } from '@pages/interfaces'
import Label from '@shared/components/Label'
import MainTitle from '@shared/components/MainTitle'
import EditableText from '@shared/utils/EditableText'
import React, { useContext, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import "swiper/css/navigation";
import ProjectCard from '@projects/components/ProjectCard'
import { Project } from '@projects/interfaces'
import ProjectPopup from '@projects/components/ProjectPopup'
import { useInView } from 'react-intersection-observer'
import { Animations } from '@shared/layouts/ProjectLayout'
const ProjectsSection = ({ projects, projectsDescription, projectsLabel, projectsTitle }: ProjectsSectionProps) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  // Use a consistent trigger across SSR/CSR and give Swiper room before it fully enters.
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: window.innerWidth < 768 ? 0.3 : 0.45,
    rootMargin: '0px 0px -15% 0px'
  })

  const anim = useContext(Animations)

  const pTitle = anim?.animProps(inView, { delay: 0, duration: 850, variant: 'fadeUp' })
  const pDesc = anim?.animProps(inView, { delay: 140, duration: 900, variant: 'blur' })

  return (
    <div ref={ref} id='projects' className="w-full py-20 scroll-m-20">
      <div className='w-full px-largeSaveSpace max-desc:px-mobSaveSpace mb-16'>
        <Label className='mx-auto' path='projectsLabel' title={projectsLabel} />
        <EditableText
          top='50%'
          path='projectsTitle'
          text={projectsTitle}
          className={`w-fit mx-auto ${pTitle?.className ?? ''}`}
          style={pTitle?.style}
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
          className={`text-arch-gray  my-4 text-lg text-center   leading-4  ${pDesc?.className ?? ''}`}
          style={pDesc?.style}
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
        className="projects-swiper"
      >
        {
          projects.map((project, index) => {

            return (
              <SwiperSlide
                key={index}
              >
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
            )
          })
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
