import { AboutSectionProps } from '@pages/interfaces'
import Button from '@shared/components/Button'
import Image from '@shared/components/Image'
import Label from '@shared/components/Label'
import MainTitle from '@shared/components/MainTitle'
import EditableObject from '@shared/utils/EditableObject'
import EditableText from '@shared/utils/EditableText'
import React from 'react'

const AboutSection = ({ aboutButton, aboutDescription, aboutImages, aboutTitle, aboutLabel }: AboutSectionProps) => {
  return (
    <div id='about' className='scroll-m-10 w-full py-20 flex justify-between items-center gap-10 max-desc:flex-col px-largeSaveSpace max-desc:px-mobSaveSpace '>
      <div>
        <Label path='aboutLabel' title={aboutLabel} />
        <EditableText
          start='10%'
          top='40%'
          path='aboutTitle'
          text={aboutTitle}
        >
          <MainTitle
            black
            children={aboutTitle}
          />
        </EditableText>
        <EditableText
          start='10%'
          top='40%'
          className='mt-4 mb-7 text-arch-gray text-justify text-lg leading-4 '
          text={aboutDescription}
          path='aboutDescription'
          richtext
          children={aboutDescription}
        />
        <EditableObject
          className='w-fit max-desc:mx-auto  max-mob:w-full'
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
        className='max-w-xl w-full rounded-lg overflow-hidden'
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
