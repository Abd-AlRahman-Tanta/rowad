import React from 'react'
import Image from './Image'
import Layer from './Layer'
import EditableArray from '@shared/utils/EditableArray'
import EditableImage from '@shared/utils/EditableImage'
import EditableText from '@shared/utils/EditableText'
import MainTitle from './MainTitle'
import Description from './Description'
import Button from './Button'
import { Link } from '@inertiajs/react'
import EditableObject from '@shared/utils/EditableObject'
import { HeroProps } from '../Types'
const Hero = (
  {
    heroBackground,
    heroProjectsButton,
    heroCoursesButton,
    heroDescription,
    heroProfileImage,
    heroTitle
  }: HeroProps
) => {
  return (
    <div
      className='w-full min-h-screen relative overflow-hidden px-largeSaveSpace max-desc:px-mobSaveSpace flex justify-center items-center  pt-32 max-desc:pt-40 pb-10'
    >
      {
        heroBackground &&
        <EditableImage
          start='40%'
          top='8rem'
          className='absolute! top-0 start-0 w-full h-full'
          src={heroBackground}
          path='heroBackground'
        >
          <Image
            className='absolute w-full h-full top-0 left-0 object-cover'
            src={heroBackground}
          />
          <div className='pointer-events-none absolute inset-0  bg-gradient-to-br from-arch-dark/35  to-arch-charcoal/50' />
        </EditableImage>
      }
      <div
        className='w-full flex justify-between items-center max-desc:items-start gap-10 max-desc:gap-5 max-desc:flex-col '
      >
        <div
          className='desc:max-w-xl  w-full'
        >
          {
            heroTitle &&
            <EditableText
              top='30%'
              start='10%'
              text={heroTitle}
              path='heroTitle'
            >
              <MainTitle
                hero
                className='mb-4'
                white
                children={heroTitle}
              />
            </EditableText>
          }
          {
            heroDescription &&
            <EditableText
              start='10%'
              top='40%'
              text={heroDescription}
              path='heroDescription'
              className='text-arch-light/90 text-lg leading-4'
              richtext
              children={heroDescription}
            />
          }
          <div
            className='flex max-mob:flex-col items-center max-desc:justify-center gap-4 mt-6'
          >
            {
              heroProjectsButton &&
              <EditableObject
                dontAddInputsFor={["id"]}
                className='max-mob:w-full'
                fields={heroProjectsButton}
                path='heroProjectsButton'
              >
                <a href={heroProjectsButton.id}>
                  <Button
                    className='max-mob:w-full'
                    children={heroProjectsButton.text}
                  />
                </a>
              </EditableObject>
            }
            {
              heroCoursesButton &&
              <EditableObject
                dontAddInputsFor={["id"]}
                className='max-mob:w-full'
                fields={heroCoursesButton}
                path='heroCoursesButton'
              >
                <a href={heroCoursesButton.id}>
                  <Button
                    className='max-mob:w-full'
                    children={heroCoursesButton.text}
                    border
                  />
                </a>
              </EditableObject>
            }
          </div>
        </div>
        {
          heroProfileImage &&
          <EditableImage
            className='max-w-sm w-full max-desc:self-center rounded-lg overflow-hidden'
            src={heroProfileImage}
            path='heroProfileImage'
          >
            <Image
              className='w-full'
              src={heroProfileImage}
            />
          </EditableImage>
        }
      </div>
    </div>
  )
}

export default Hero
