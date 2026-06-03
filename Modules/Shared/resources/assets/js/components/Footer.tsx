import { FooterProps } from '@shared/Types'
import EditableImage from '@shared/utils/EditableImage'
import React from 'react'
import Image from './Image'
import EditableArray from '@shared/utils/EditableArray'
import EditableObject from '@shared/utils/EditableObject'
import SectionTitle from './SectionTitle'
import EditableText from '@shared/utils/EditableText'
import Description from './Description'
import { router, usePage } from '@inertiajs/react'

const Footer = ({ contactInformations, footerLogo, footerRightsText, footerSocialMediaLinks, siteMap, contactTitle, siteMapTitle }: FooterProps) => {
  const { component } = usePage()
  const scrollToSection = (id: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.visit("/" + id);
  }
  return (
    <div className='w-full py-20 bg-arch-charcoal'>
      <div className='w-full px-largeSaveSpace max-desc:px-mobSaveSpace'>
        <div className='w-full  flex max-desc:flex-col justify-between gap-8 pb-8'>
          <div>
            <EditableImage
              className='w-fit desc:mx-auto'
              src={footerLogo}
              path='footerLogo'
            >
              <Image src={footerLogo} className='w-28 object-contain ' />
            </EditableImage>
            <EditableArray
              top='-1.5rem'
              className='flex items-center gap-4 mt-6'
              fields={footerSocialMediaLinks[0]}
              path='footerSocialMediaLinks'
            >
              {
                footerSocialMediaLinks.map((socialmedia, i) => (
                  <EditableObject
                    key={i}
                    fields={socialmedia}
                    path={`footerSocialMediaLinks.${i}`}
                    deletable
                    hideFirst
                  >
                    <a href={socialmedia.link} target='_blank'>
                      <Image src={socialmedia.icon} className='w-5 object-contain' />
                    </a>
                  </EditableObject>
                ))
              }
            </EditableArray>
          </div>
          <div>
            <EditableText
              className='w-fit mb-5'
              text={siteMapTitle}
              path='siteMapTitle'
            >
              <SectionTitle children={siteMapTitle} className='text-arch-card font-medium text-xl  leading-2' />
            </EditableText>
            {
              siteMap.map((site, i) => (
                <EditableText
                  key={i}
                  text={site.text}
                  path={`siteMap.${i}.text`}
                  className='mb-4 w-fit'
                >
                  <a
                    className='text-arch-card leading-2 hover:underline underline-offset-8'
                    onClick={(e) => component != "Home" && scrollToSection(site.id, e)}
                    href={site.id}>
                    {site.text}
                  </a>
                </EditableText>
              ))
            }
          </div>
          <div>
            <EditableText
              className='w-fit mb-5'
              text={contactTitle}
              path='contactTitle'
            >
              <SectionTitle children={contactTitle} className='text-arch-card font-medium text-xl  leading-2' />
            </EditableText>
            <div dir='ltr' className='w-fit'>
              <EditableArray
                fields={contactInformations[0]}
                path='contactInformations'
              >
                {
                  contactInformations.map((contact, i) => (
                    <EditableObject
                      key={i}
                      deletable
                      hideFirst
                      fields={contact}
                      path={`contactInformations.${i}`}
                      className='flex items-center gap-2 mb-6 w-fit'
                    >
                      <Image src={contact.icon} className='w-5 object-contain' />
                      <a
                        target='_blank'
                        className='text-arch-card leading-2'
                        href={contact.link}>
                        {contact.text}
                      </a>
                    </EditableObject>
                  ))
                }
              </EditableArray>
            </div>
          </div>
        </div>
        <div className='w-full  pt-8 border-t-2 border-t-arch-card/10'>
          <EditableText
            richtext
            text={footerRightsText}
            path='footerRightsText'
            className='text-arch-card text-center text-lg leading-2'
            children={footerRightsText}
          />
        </div>
      </div>
    </div>
  )
}

export default Footer
