import { CoursesSectionProps } from '@pages/interfaces'
import MainTitle from '@shared/components/MainTitle';
import React from 'react'
import CourseCard from './CourseCard';
import Pagination from '@shared/components/Pagination';
import EditableText from '@shared/utils/EditableText';
import Label from '@shared/components/Label';

const CoursesSection = ({ viewCourseButton, courses, coursesTitle, links, coursesLabel }: CoursesSectionProps) => {
  return (
    <div id='courses' className="scroll-m-10 py-16 px-largeSaveSpace max-desc:px-mobSaveSpace bg-arch-accent/10">
      <Label path='coursesLabel' title={coursesLabel} />
      <EditableText path='coursesTitle' text={coursesTitle} className="w-fit mb-14">
        <MainTitle black>
          {coursesTitle}
        </MainTitle>
      </EditableText>
      <div className="grid max-mob:grid-cols-1 max-desc:grid-cols-2 grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            viewCourseButton={viewCourseButton}
            {...course}
          />
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <Pagination links={links} />
      </div>
    </div>
  );
}

export default CoursesSection
