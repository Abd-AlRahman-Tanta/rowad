import { CoursesSectionProps } from '@pages/interfaces'
import MainTitle from '@shared/components/MainTitle';
import React, { useContext } from 'react'
import CourseCard from './CourseCard';
import Pagination from '@shared/components/Pagination';
import EditableText from '@shared/utils/EditableText';
import Label from '@shared/components/Label';
import { useInView } from 'react-intersection-observer'
import { Animations } from '@shared/layouts/ProjectLayout'

const CoursesSection = ({ viewCourseButton, courses, coursesTitle, links, coursesLabel }: CoursesSectionProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: window.innerWidth < 768 ? 0.3 : 0.6 })
  const anim = useContext(Animations)

  const pTitle = anim?.animProps(inView, { delay: 0, duration: 800, variant: 'fadeUp' })

  return (
    <div ref={ref} id='courses' className="scroll-m-10 py-16 px-largeSaveSpace max-desc:px-mobSaveSpace bg-arch-accent/10">
      <Label path='coursesLabel' title={coursesLabel} />
      <EditableText path='coursesTitle' text={coursesTitle} className={`w-fit mb-14 ${pTitle?.className ?? ''}`} style={pTitle?.style}>
        <MainTitle black>
          {coursesTitle}
        </MainTitle>
      </EditableText>
      <div className="w-full flex flex-wrap justify-center gap-8">
        {courses.map((course, index) => {
          const pCard = anim?.animProps(inView, {
            delay: 140 + (index % 6) * 90,
            duration: 850,
            variant: index % 2 === 0 ? 'fadeUp' : 'fadeDown'
          })
          return (
            <CourseCard
              key={course.id}
              viewCourseButton={viewCourseButton}
              {...course}
              anim={pCard}
            />
          )
        })}
      </div>
      <div className="mt-14 flex justify-center">
        <Pagination links={links} />
      </div>
    </div>
  );
}

export default CoursesSection
