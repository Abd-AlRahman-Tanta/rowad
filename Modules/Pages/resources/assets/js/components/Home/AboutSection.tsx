import { AboutSectionProps } from '@pages/interfaces'
import Button from '@shared/components/Button'
import Image from '@shared/components/Image'
import Label from '@shared/components/Label'
import MainTitle from '@shared/components/MainTitle'
import EditableObject from '@shared/utils/EditableObject'
import EditableText from '@shared/utils/EditableText'
import React, { useContext } from 'react'
import { useInView } from 'react-intersection-observer'
import { Animations } from '@shared/layouts/ProjectLayout'

const AboutSection = ({ aboutButton, aboutDescription, aboutImages, aboutTitle, aboutLabel }: AboutSectionProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.6 })
  const anim = useContext(Animations)

  const pTitle = anim?.animProps(inView, { delay: 0, duration: 800, variant: 'fadeUp' })
  const pDesc = anim?.animProps(inView, { delay: 120, duration: 850, variant: 'blur' })
  const pBtn = anim?.animProps(inView, { delay: 240, duration: 750, variant: 'zoom' })
  const pImg = anim?.animProps(inView, { delay: 150, duration: 900, variant: 'fadeRight' })

  return (
    <div ref={ref} id='about' className='scroll-m-10 w-full py-20 flex justify-between items-center gap-10 max-desc:flex-col px-largeSaveSpace max-desc:px-mobSaveSpace '>
      <div>
        <Label path='aboutLabel' title={aboutLabel} />
        <EditableText
          start='10%'
          top='40%'
          path='aboutTitle'
          text={aboutTitle}
          className={pTitle?.className}
          style={pTitle?.style}
        >
          <MainTitle
            black
            children={aboutTitle}
          />
        </EditableText>
        <EditableText
          start='10%'
          top='40%'
          className={`mt-4 mb-7 text-arch-gray text-justify text-lg leading-4 ${pDesc?.className ?? ''}`}
          style={pDesc?.style}
          text={aboutDescription}
          path='aboutDescription'
          richtext
          children={aboutDescription}
        />
        <EditableObject
          dontAddInputsFor={["id"]}
          className={`w-fit max-desc:mx-auto  max-mob:w-full ${pBtn?.className ?? ''}`}
          style={pBtn?.style}
          path='aboutButton'
          fields={aboutButton}
        >
          <a target='' href={aboutButton.id}>
            <Button
              className='max-mob:w-full'
              children={aboutButton.text}
            />
          </a>
        </EditableObject>
      </div>
      <EditableObject
        className={`max-w-xl max-xl:max-w-md shrink-0  w-full rounded-lg overflow-hidden ${pImg?.className ?? ''}`}
        style={pImg?.style}
        path='aboutImages'
        fields={aboutImages}
      >
        <Image
          className='w-full h-full absolute inset-0  object-cover '
          src={aboutImages.image2}
        />
        <Image
          className='w-full aspect-[1.2] object-cover mix-blend-multiply  opacity-85 '
          src={aboutImages.image1}
        />
      </EditableObject>
    </div>
  )
}

export default AboutSection
