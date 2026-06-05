import { CourseProps } from "@pages/interfaces";
import Button from "@shared/components/Button";
import Image from "@shared/components/Image";
import MainTitle from "@shared/components/MainTitle";
import EditableObject from "@shared/utils/EditableObject";
import EditableText from "@shared/utils/EditableText";
import PageContentProvider from "@shared/utils/PageContentProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import Label from "@shared/components/Label";
import CourseCard from "@pages/components/Home/CourseCard";
import Pagination from "@shared/components/Pagination";
import React, { useContext } from "react";
import { useInView } from "react-intersection-observer";
import { Animations } from "@shared/layouts/ProjectLayout";
const CourseDetailsPage = ({ allData }: { allData: any }) => {
  const { data, course, moreCourses }: { data: any; course: CourseProps, moreCourses: { courses: CourseProps[], links: any[] } } = allData;
  const { courses, links } = moreCourses

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12, rootMargin: '0px 0px -10% 0px' })
  const anim = useContext(Animations)

  const pCard = anim?.animProps(inView, { delay: 0, duration: 900, variant: 'zoom' })
  const pLeft = anim?.animProps(inView, { delay: 120, duration: 850, variant: 'fadeLeft' })
  const pRight = anim?.animProps(inView, { delay: 220, duration: 850, variant: 'fadeRight' })

  return (
    <PageContentProvider pageName="Course">
      <div ref={ref} className="pb-16 pt-32 relative bg-arch-accent/10">
        <div className="px-largeSaveSpace max-desc:px-mobSaveSpace ">
          <Image
            className="w-full h-[80vh] object-cover absolute inset-0 "
            src={course.heroImage}
          />
          <div className="relative z-10">
            <div className={`bg-arch-card rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 desc:grid-cols-2 content-center ${pCard?.className ?? ''}`} style={pCard?.style}>
              <div className={`p-8 max-mob:p-6 text-arch-dark ${pLeft?.className ?? ''}`} style={pLeft?.style}>
                <Image
                  src={course.image}
                  className="w-full aspect-[1.5] object-cover rounded-2xl mb-10"
                />
                <MainTitle black className="mb-7">
                  {course.name}
                </MainTitle>
                <div className="text-arch-gray leading-8 text-lg mb-2"
                  dangerouslySetInnerHTML={{ __html: course.description }} />
                <div className="mb-6">
                  <EditableText
                    path="priceTitle"
                    text={data.priceTitle}
                    className="text-sm font-semibold text-arch-accent w-fit"
                  >
                    {data.priceTitle}
                  </EditableText>
                  <div
                    className="text-3xl font-bold text-arch-dark"
                  >
                    {course.price}<span className="text-arch-accent">$</span>
                  </div>
                </div>
                <EditableObject
                  className="w-fit max-mob:w-full"
                  fields={data.enrollButton}
                  path="enrollButton"
                >
                  <a target="_blank" href={data.enrollButton.link}>
                    <Button className="mx-auto max-mob:w-full">
                      {data.enrollButton.text}
                    </Button>
                  </a>
                </EditableObject>
              </div>
              <div className={`p-8 max-mob:p-6 desc:border-s border-gray-300 ${pRight?.className ?? ''}`} style={pRight?.style}>
                {course.newCourse && (
                  <EditableText path="newCourseTitle" text={data.newCourseTitle} className="block w-fit bg-arch-accent text-arch-light px-4 py-1 rounded-full text-sm font-semibold mb-6">
                    {data.newCourseTitle}
                  </EditableText>
                )}
                <div className="mb-6">
                  <EditableText start="10%" path="CourseTopicsTitle" text={data.CourseTopicsTitle} className="text-2xl font-bold mb-3 text-arch-dark">
                    {data.CourseTopicsTitle}
                  </EditableText>
                  <ul className="space-y-2">
                    {course.topics.map((topic) => (
                      <li
                        key={topic.id}
                        className="flex items-center gap-3 text-arch-charcoal leading-7"
                      >
                        <span className=" w-2 aspect-square bg-arch-accent/95 rounded-full"></span>
                        {topic.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <EditableText start="10%"
                    text={data.learningPointsTitle}
                    path="learningPointsTitle"
                    className="text-2xl font-bold mb-3 text-arch-dark">
                    {data.learningPointsTitle}
                  </EditableText>
                  <ul className="space-y-2">
                    {course.learningPoints.map((point) => (
                      <li
                        key={point.id}
                        className="flex items-center gap-3 text-arch-charcoal  leading-7"
                      >
                        <span className=" w-2 h-2 bg-arch-accent/95 rounded-full"></span>
                        {point.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Course Gallery Slider */}
        {
          course.images.length > 0 &&
          (() => {
            const pGalleryHead = anim?.animProps(inView, { delay: 140, duration: 850, variant: 'fadeUp' })
            const pGallery = anim?.animProps(inView, { delay: 240, duration: 900, variant: 'blur' })

            return (
              <div className={`relative pt-16 overflow-hidden  ${pGallery?.className ?? ''}`} style={pGallery?.style}>
                <div className={`mb-8 px-largeSaveSpace max-desc:px-mobSaveSpace ${pGalleryHead?.className ?? ''}`} style={pGalleryHead?.style}>
                  <Label title={data.label} path="label" />
                  <EditableText className="w-fit" path="title" text={data.title}>
                    <MainTitle black >
                      {data.title}
                    </MainTitle>
                  </EditableText>
                </div>
                <Swiper
                  modules={[Autoplay, Navigation, EffectCoverflow]}
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  loop={true}
                  slidesPerView={"auto"}
                  speed={900}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  navigation={{
                    nextEl: ".arch-next",
                    prevEl: ".arch-prev",
                  }}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 60,
                    depth: 220,
                    modifier: 1,
                    slideShadows: false,
                    scale: 0.82,
                  }}
                  className="!overflow-visible"
                >
                  {course.images.map((image, index) => (
                    <SwiperSlide
                      key={index}
                      className="!w-[320px] mob:!w-[420px] tab:!w-[560px] desc:!w-[680px]"
                    >
                      {({ isActive }) => (
                        <div
                          className={`relative overflow-hidden transition-all duration-700 ${isActive ? "opacity-100" : "opacity-40 scale-95"
                            }`}
                        >
                          {/* Main image */}
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                              src={image.image}
                              className={`w-full h-full object-cover transition-all duration-700 ${isActive ? "grayscale-0 scale-100" : "grayscale scale-105"
                                }`}
                            />
                            {/* Dark overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                            {/* Accent bottom line - only on active */}
                            <div
                              className={`absolute bottom-0 left-0 h-[2px] bg-arch-accent transition-all duration-700 ${isActive ? "w-full" : "w-0"
                                }`}
                            />
                            {/* Label */}
                            <div className="absolute bottom-5 left-5 bg-arch-dark px-2 py-1">
                              <div className="text-arch-card font-medium text-sm">
                                {` ${index + 1}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex items-center justify-between mt-6  px-largeSaveSpace max-desc:px-mobSaveSpace   ">
                  {/* Prev button */}
                  <EditableText
                    className="w-fit"
                    text={data.prevLabel}
                    path="prevLabel"
                  >
                    <Button className="arch-prev">
                      <span className="flex items-center justify-center w-10 h-10">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </span>
                      <span className="text-xs tracking-[0.12em] uppercase hidden sm:block ">{data.prevLabel}</span>
                    </Button>
                  </EditableText>
                  {/* Decorative line with dot */}
                  <div className="flex items-center gap-2 flex-1 mx-6">
                    <div className="h-[1px] flex-1 bg-gray-300" />
                    <span className="w-3 aspect-square bg-arch-accent rounded-full" />
                    <div className="h-[1px] flex-1 bg-gray-300" />
                  </div>
                  {/* Next button */}
                  <EditableText
                    className="w-fit"
                    text={data.nextLabel}
                    path="nextLabel"
                  >
                    <Button className="arch-next">
                      <span className="text-xs tracking-[0.12em] uppercase hidden sm:block ">{data.nextLabel}</span>
                      <span className="flex items-center justify-center w-10 h-10 ">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </span>
                    </Button>
                  </EditableText>
                </div>
              </div>
            )
          })()
        }
        <div className="w-full px-largeSaveSpace max-desc:px-mobSaveSpace pt-20">
          {(() => {
            const pMoreHead = anim?.animProps(inView, { delay: 0, duration: 850, variant: 'fadeUp' })
            return (
              <div className={pMoreHead?.className} style={pMoreHead?.style}>
                <Label title={data.showMoreLabel} path="showMoreLabel" />
                <EditableText
                  text={data.showMoreTitle}
                  path="showMoreTitle"
                  className="w-fit mb-14"
                >
                  <MainTitle black children={data.showMoreTitle} />
                </EditableText>
              </div>
            )
          })()}
          <div className="w-full flex flex-wrap justify-center gap-8">
            {courses.map((c, index) => {
              const pDomino = anim?.animProps(inView, {
                delay: 140 + (index % 9) * 90,
                duration: 900,
                variant: index % 2 === 0 ? 'fadeUp' : 'fadeDown'
              })
              return (
                <CourseCard
                  key={c.id}
                  anim={pDomino}
                  viewCourseButton={data.viewCourseButton}
                  {...c}
                />
              )
            })}
          </div>
          <div className="mt-14 flex justify-center">
            <Pagination links={links} />
          </div>
        </div>
      </div>
    </PageContentProvider>
  );
};

export default CourseDetailsPage;