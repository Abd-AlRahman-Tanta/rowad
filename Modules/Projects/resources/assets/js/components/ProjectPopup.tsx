import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/thumbs";
import { Project } from "@projects/interfaces";
import Description from "@shared/components/Description";
import SectionTitle from "@shared/components/SectionTitle";
import Button from "@shared/components/Button";
import { usePage } from "@inertiajs/react";

interface Props {
  project: Project;
  onClose: () => void;
}

const ProjectPopup = ({ project, onClose }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  // close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (!project) return null;

  const { locale } = usePage().props
  return (
    <div className="fixed inset-0 z-[1300] bg-black/80 flex items-center justify-center animate-fadeIn">

      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-[90%] max-w-[1920px] h-[90%] bg-arch-light rounded-2xl removeScroll shadow-2xl flex max-desc:flex-col animate-scaleIn overflow-auto">

        {/* LEFT: Slider */}
        <div className="w-[60%] h-full max-desc:w-full  bg-black removeScroll ">

          {/* MAIN IMAGE */}
          <div className="h-[calc(100%-100px)]" >
            <Swiper
              modules={[Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              className="h-full"
            >
              {project.images.map((img: any, i: number) => (
                <SwiperSlide key={i}>
                  <img
                    src={img.image}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* THUMBNAILS */}
          <div className="h-[100px] p-2 bg-black">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              spaceBetween={10}
              watchSlidesProgress
              className="h-full"
            >
              {project.images.map((img: any, i: number) => (
                <SwiperSlide className="p-2" key={i}>
                  <div className="h-full w-full cursor-pointer rounded-md overflow-hidden border-2 border-transparent  swiper-thumb">
                    <img
                      src={img.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>

        {/* RIGHT: Info */}
        <div className="w-[40%] max-desc:w-full p-10 max-desc:p-6 max-mob:p-mobSaveSpace flex flex-col justify-center">

          <Description className="text-sm text-gray-400 mb-2">
            {project.created_at}
          </Description>

          <SectionTitle className="text-3xl font-bold mb-4">
            {project.name}
          </SectionTitle>

          <Description className="text-gray-600 leading-7">
            {project.description}
          </Description>

          <Button
            className="mt-6 w-fit max-mob:w-full"
            children={locale === "en" ? "close" : "اغلاق"}
            clickFunction={onClose}
          />
        </div>
      </div>
    </div >
  );
};

export default ProjectPopup;