"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { StudentReviewsProps } from "@pages/interfaces";
import Label from "@shared/components/Label";
import EditableText from "@shared/utils/EditableText";
import MainTitle from "@shared/components/MainTitle";
import { FaArrowRight } from "react-icons/fa6";
import Button from "@shared/components/Button";
import EditableObject from "@shared/utils/EditableObject";
import Image from "@shared/components/Image";
import SectionTitle from "@shared/components/SectionTitle";
import Description from "@shared/components/Description";
import EditableArray from "@shared/utils/EditableArray";
import Review from "./Review";
import React, { useContext } from 'react'
import { useInView } from 'react-intersection-observer'
import { Animations } from '@shared/layouts/ProjectLayout'


export default function StudentReviews({ reviews, reviewsLabel, reviewsTitle }: StudentReviewsProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: window.innerWidth < 768 ? 0.3 : 0.5 })
  const anim = useContext(Animations)
  const pTitle = anim?.animProps(inView, { delay: 0, duration: 850, variant: 'fadeUp' })
  const pSlider = anim?.animProps(inView, { delay: 160, duration: 900, variant: 'zoom' })

  return (
    <section ref={ref} id="reviews" className="w-full py-24 bg-arch-accent/10 overflow-hidden scroll-m-8">
      <div className="px-largeSaveSpace max-desc:px-mobSaveSpace">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Label title={reviewsLabel} path="reviewsLabel" />
            <EditableText
              className={`w-fit ${pTitle?.className ?? ''}`}
              style={pTitle?.style}
              path="reviewsTitle"
              text={reviewsTitle}
            >
              <MainTitle children={reviewsTitle} black />
            </EditableText>
          </div>
          <div className="hidden tab:flex rtl:flex-row-reverse items-center gap-3">
            <Button className="student-prev button">
              <FaArrowRight className="-scale-x-100" />
            </Button>
            <Button className="student-next button">
              <FaArrowRight />
            </Button>
          </div>
        </div>
        {/* Slider */}
        <EditableArray
          fields={reviews[0]}
          path="reviews"
          top="-1rem"
          start="1rem"
          className={pSlider?.className}
          style={pSlider?.style}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            centeredSlides
            spaceBetween={24}
            slidesPerView={1.2}
            speed={900}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: ".student-prev",
              nextEl: ".student-next",
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
            }}
            className="!overflow-visible"
          >
            {reviews.map((review, index) => {
              if (index === 0) return null

              // Domino: stagger repeats every 8 slides so it stays snappy.
              const pReview = anim?.animProps(inView, {
                delay: 220 + (index % 8) * 90,
                duration: 900,
                variant: index % 2 === 0 ? 'fadeUp' : 'fadeDown'
              })

              return (
                <SwiperSlide key={index}>
                  <EditableObject
                    path={`reviews.${index}`}
                    fields={review}
                    deletable
                    richText
                    className={pReview?.className}
                    style={pReview?.style}
                  >
                    <Review {...review} index={index} />
                  </EditableObject>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </EditableArray>
      </div>
    </section>
  );
}