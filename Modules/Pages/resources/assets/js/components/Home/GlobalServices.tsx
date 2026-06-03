import { GlobalServicesProps } from '@pages/interfaces'
import Button from '@shared/components/Button'
import Image from '@shared/components/Image'
import SectionTitle from '@shared/components/SectionTitle'
import EditableArray from '@shared/utils/EditableArray'
import EditableObject from '@shared/utils/EditableObject'
import React from 'react'

const GlobalServices = ({ discoverButton, services }: GlobalServicesProps) => {
  return (
    <div className='w-full px-largeSaveSpace max-desc:px-mobSaveSpace py-20'>
      <EditableArray top='-1.5rem' path='services' fields={services[0]} className='w-full'>
        {
          services.map((service, i) => (
            <EditableObject
              top='30%'
              start={i % 2 == 0 ? "10%" : "90%"}
              key={i}
              richText
              fields={service}
              deletable
              hideFirst
              path={`services.${i}`}
              className={`w-full flex ${i % 2 == 0 ? "max-desc:flex-col" : "max-desc:flex-col flex-row-reverse"}  justify-between items-center gap-8 mb-10`}
            >
              <div>
                <SectionTitle
                  children={service.title}
                  className='text-xl font-bold text-arch-dark leading-2 mb-4'
                />
                <div
                  className='text-arch-gray text-lg leading-2'
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
              <Image
                src={service.image}
                className='max-w-xl w-full'
              />
            </EditableObject>
          ))
        }
      </EditableArray>
      <EditableObject
        className='w-fit max-mob:w-full mx-auto mt-24'
        fields={discoverButton}
        path='discoverButton'
      >
        <a href={discoverButton.link} target='_blank' className='max-mob:w-full max-mob:block'>
          <Button
            className='max-mob:w-full'
            children={discoverButton.text}
          />
        </a>
      </EditableObject>
    </div>
  )
}

export default GlobalServices
