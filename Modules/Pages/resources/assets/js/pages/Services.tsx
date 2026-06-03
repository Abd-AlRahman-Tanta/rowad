import GlobalServices from '@pages/components/Home/GlobalServices'
import { GlobalServicesProps } from '@pages/interfaces'
import Hero from '@shared/components/Hero'
import { HeroProps } from '@shared/Types'
import PageContentProvider from '@shared/utils/PageContentProvider'
import React from 'react'

const Services = ({ allData }: { allData: any }) => {
  const { data, serviceName } = allData
  const hero: HeroProps = {
    heroBackground: data.heroBackground,
    heroDescription: data.heroDescription,
    heroTitle: data.heroTitle
  }
  const global: GlobalServicesProps = {
    discoverButton: data.discoverButton,
    services: data.services
  }
  return (
    <PageContentProvider pageName={serviceName}>
      <div>
        <Hero {...hero} />
        <GlobalServices {...global} />
      </div>
    </PageContentProvider>
  )
}

export default Services
