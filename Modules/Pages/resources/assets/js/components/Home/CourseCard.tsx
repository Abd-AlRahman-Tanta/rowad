import { Link, usePage } from '@inertiajs/react';
import { CourseProps } from '@pages/interfaces'
import Button from '@shared/components/Button';
import Description from '@shared/components/Description';
import Image from '@shared/components/Image';
import SectionTitle from '@shared/components/SectionTitle';
import EditableObject from '@shared/utils/EditableObject';
import React from 'react'

const CourseCard = ({ topics, description, image, learningPoints, name, price, id, newCourse, viewCourseButton }: CourseProps & { viewCourseButton: { text: string, link: string } }) => {
  const { locale } = usePage().props
  return (
    <div
      className="
        bg-arch-card
        rounded-3xl
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
        border border-gray-100
        group
        flex flex-col justify-between
      "
    >
      <div className="relative w-full">
        <Image
          src={image}
          className="
            h-64
            w-full
            object-cover
            group-hover:scale-105
            transition-all
            duration-500
          "
        />
        {newCourse && (
          <div
            className="
              absolute
              top-4
              end-4
              bg-arch-accent
              text-arch-light
              text-xs
              px-3
              py-1
              rounded-full
              font-semibold
              shadow-lg
            "
          >
            {locale == "en" ? "NEW" : "جديد"}
          </div>
        )}
      </div>
      <div className="p-6 w-full grow flex flex-col justify-between">
        <SectionTitle
          className="
            w-full
            text-xl
            font-bold
            text-arch-dark
            mb-3
          "
        >
          {name}
        </SectionTitle>
        <EditableObject
          className='w-fit max-mob:w-full'
          dontAddInputsFor={['link']}
          fields={viewCourseButton}
          path='viewCourseButton'
        >
          <Button className='max-mob:w-full'>
            <Link
              href={viewCourseButton.link + id}
            >
              {viewCourseButton.text}
            </Link>
          </Button>
        </EditableObject>
      </div>
    </div>
  );
}

export default CourseCard