import { usePage } from '@inertiajs/react'
import { AchivementsProps } from '@pages/interfaces'
import Image from '@shared/components/Image'
import Label from '@shared/components/Label'
import MainTitle from '@shared/components/MainTitle'
import SectionTitle from '@shared/components/SectionTitle'
import EditableArray from '@shared/utils/EditableArray'
import EditableImage from '@shared/utils/EditableImage'
import EditableObject from '@shared/utils/EditableObject'
import EditableText from '@shared/utils/EditableText'
import React from 'react'

const AchivementsSection = ({ achivements, achivementsLabel, achivementsTitle, achivementsImage }: AchivementsProps) => {
  const { locale } = usePage().props
  return (
    <div id='achivements' className='w-full scroll-m-20 px-largeSaveSpace max-desc:px-mobSaveSpace  py-20 relative'>
      <EditableImage start='90%' top='4rem' path='achivementsImage' src={achivementsImage} className='w-full h-full absolute! top-0 left-0 '>
        <Image className='w-full h-full absolute top-0 left-0 object-cover opacity-10' src={achivementsImage} />
      </EditableImage>
      <Label title={achivementsLabel} path='achivementsLabel' className='mx-auto' />
      <EditableText path='achivementsTitle' text={achivementsTitle} className='mb-6 w-fit mx-auto mt-2 '>
        <MainTitle center black children={achivementsTitle} />
      </EditableText>
      <div dir='ltr'>
        <EditableArray
          top='-0.8rem'
          start='4rem'
          fields={achivements[0]}
          path='achivements'
          className='flex flex-col items-center max-desc:items-start gap-8 w-full pt-4 '
        >
          {
            achivements.map((ahv, i) => (
              <EditableObject
                key={i}
                path={`achivements.${i}`}
                fields={ahv}
                hideFirst
                deletable
                richText
                className={` ${i % 2 != 0 ? "desc:-translate-x-1/2 desc:left-5" : "desc:translate-x-1/2 desc:right-5"}  z-10 `}
                top='40%'
                start='40%'
              >
                <div className={`w-fit  flex max-desc:flex-col-reverse 
                ${i % 2 == 0 && "desc:flex-row-reverse"}  items-start max-desc:items-center  gap-8 `}
                >
                  <div dir={locale == "ar" ? "rtl" : "ltr"} className='desc:max-w-[23rem] w-full  '>
                    <SectionTitle children={ahv.title} className={`text-2xl leading-4 text-arch-dark  font-medium mb-3  `} />
                    <div
                      className='text-lg text-arch-gray leading-3'
                      dangerouslySetInnerHTML={{ __html: ahv.description }}
                    />
                  </div>
                  <div
                    className='shrink-0 mt-3 w-10 aspect-square rounded-full flex justify-center items-center text-arch-card bg-arch-accent '
                    children={i}
                  />
                </div>
              </EditableObject>
            ))
          }
          <div className='w-1 bg-arch-gray/20 h-full absolute top-0 left-1/2 -translate-x-1/2 max-desc:hidden' />
        </EditableArray>
      </div>
    </div>
  )
}

export default AchivementsSection
