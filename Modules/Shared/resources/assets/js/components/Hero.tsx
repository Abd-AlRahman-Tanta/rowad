import React, { useContext } from 'react'
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
import { useInView } from 'react-intersection-observer'
import { Animations } from '../layouts/ProjectLayout'
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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  })

  const anim = useContext(Animations)
  const pTitle = anim?.animProps(inView, { delay: 0, duration: 800, variant: 'fadeLeft' })
  const pDesc = anim?.animProps(inView, { delay: 150, duration: 850, variant: 'fadeLeft' })
  const pBtnsWrap = anim?.animProps(inView, { delay: 300, duration: 750, variant: 'blur' })
  const pBtn1 = anim?.animProps(inView, { delay: 350, duration: 700, variant: 'fadeLeft' })
  const pBtn2 = anim?.animProps(inView, { delay: 450, duration: 700, variant: 'fadeLeft' })
  const pImg = anim?.animProps(inView, { delay: 250, duration: 900, variant: 'fadeRight' })

  return (
    <div
      ref={ref}
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
              className={pTitle?.className}
              style={pTitle?.style}
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
              className={`text-arch-light/90 text-lg leading-4 ${pDesc?.className ?? ''}`}
              style={pDesc?.style}
              richtext
              children={heroDescription}
            />
          }
          <div
            className={`flex max-mob:flex-col items-center max-desc:justify-center gap-4 mt-6 ${pBtnsWrap?.className ?? ''}`}
            style={pBtnsWrap?.style}
          >
            {
              heroProjectsButton &&
              <EditableObject
                dontAddInputsFor={["id"]}
                className={`max-mob:w-full ${pBtn1?.className ?? ''}`}
                style={pBtn1?.style}
                fields={heroProjectsButton}
                path='heroProjectsButton'
              >
                <a href={heroProjectsButton.id} className='max-mob:w-full'>
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
                className={`max-mob:w-full ${pBtn2?.className ?? ''}`}
                style={pBtn2?.style}
                fields={heroCoursesButton}
                path='heroCoursesButton'
              >
                <a href={heroCoursesButton.id} className='max-mob:w-full'>
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
            className={`max-w-sm w-full max-desc:self-center rounded-lg overflow-hidden ${pImg?.className ?? ''}`}
            style={pImg?.style}
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
