import { Link, router } from "@inertiajs/react";
import { ServicesSectionProps } from "@pages/interfaces";
import Button from "@shared/components/Button";
import Image from "@shared/components/Image";
import Label from "@shared/components/Label";
import MainTitle from "@shared/components/MainTitle";
import SectionTitle from "@shared/components/SectionTitle";
import EditableObject from "@shared/utils/EditableObject";
import EditableText from "@shared/utils/EditableText";
import React, { useContext } from "react";
import { useInView } from 'react-intersection-observer'
import { Animations } from '@shared/layouts/ProjectLayout'



const ServicesSection = ({ services, servicesLabel, servicesTitle, viewCardButtonText }: ServicesSectionProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: window.innerWidth < 768 ? 0.3 : 0.6 })
  const anim = useContext(Animations)
  const pHead = anim?.animProps(inView, { delay: 0, duration: 800, variant: 'fadeUp' })

  const goToPage = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    router.visit(link)
  }
  return (
    <section ref={ref} id="services" className="py-20 bg-arch-accent/10 px-largeSaveSpace max-desc:px-mobSaveSpace scroll-m-16">
      <div className="">
        <Label title={servicesLabel} path="servicesLabel" />
        <EditableText
          className={`w-fit mt-1 mb-8 ${pHead?.className ?? ''}`}
          style={pHead?.style}
          text={servicesTitle}
          path="servicesTitle"
        >
          <MainTitle children={servicesTitle} black />
        </EditableText>
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service, index) => {
            const pCard = anim?.animProps(inView, {
              delay: 120 + (index % 6) * 80,
              duration: 800,
              variant: index % 2 === 0 ? 'fadeUp' : 'fadeDown'
            })

            return (
              <EditableObject
                dontAddInputsFor={["link"]}
                richText
                fields={service}
                path={`services.${index}`}
                key={index}
                className={`bg-arch-light rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-arch-accent w-[calc((100%-3rem)/3)] max-desc:w-[calc((100%-1.5rem)/2)] max-mob:w-full ${pCard?.className ?? ''}`}
                style={pCard?.style}
              >
                <a
                  className="w-full p-6  h-full flex flex-col justify-between"
                  onClick={(e) => !service.link.includes("#") && goToPage(e, service.link)}
                  href={service.link}
                >
                  <div>
                    <div className="rounded-lg bg-arch-accent/20 p-3 w-fit aspect-square flex items-center justify-center mb-6">
                      <Image src={service.icon} className="w-16 object-contain" />
                    </div>
                    <SectionTitle className="font-bold text-xl text-arch-dark mb-3 " children={service.title} />
                    <div className="text-arch-gray font-medium" dangerouslySetInnerHTML={{ __html: service.description }} />
                  </div>
                  <EditableText
                    text={viewCardButtonText}
                    path="viewCardButtonText"
                    className="w-fit max-mob:w-full mt-5"
                  >
                    <Button className="max-mob:w-full" children={viewCardButtonText} />
                  </EditableText>
                </a>
              </EditableObject>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;