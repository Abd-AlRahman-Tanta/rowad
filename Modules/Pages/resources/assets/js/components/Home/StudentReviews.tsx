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


export default function StudentReviews({ reviews, reviewsLabel, reviewsTitle }: StudentReviewsProps) {
  return (
    <section id="reviews" className="w-full py-24 bg-arch-accent/10 overflow-hidden scroll-m-8">
      <div className="px-largeSaveSpace max-desc:px-mobSaveSpace">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Label title={reviewsLabel} path="reviewsLabel" />
            <EditableText
              className="w-fit"
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
            {reviews.map((review, index) => (
              index > 0 &&
              <SwiperSlide key={index}>
                <EditableObject
                  path={`reviews.${index}`}
                  fields={review}
                  deletable
                  richText
                >
                  <Review {...review} index={index} />
                </EditableObject>
              </SwiperSlide>
            ))}
          </Swiper>
        </EditableArray>
      </div>
    </section>
  );
}