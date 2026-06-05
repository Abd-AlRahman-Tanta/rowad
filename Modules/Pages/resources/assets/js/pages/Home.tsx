import AboutSection from '@pages/components/Home/AboutSection'
import AchivementsSection from '@pages/components/Home/AchivementsSection'
import CoursesSection from '@pages/components/Home/CoursesSection'
import ProjectsSection from '@pages/components/Home/ProjectsSection'
import ServicesSection from '@pages/components/Home/ServicesSection'
import StudentReviews from '@pages/components/Home/StudentReviews'
import { AboutSectionProps, AchivementsProps, CourseProps, CoursesSectionProps, ProjectsSectionProps, ServicesSectionProps, StudentReviewsProps } from '@pages/interfaces'
import { Project } from '@projects/interfaces'
import Hero from '@shared/components/Hero'
import { HeroProps } from '@shared/Types'
import PageContentProvider from '@shared/utils/PageContentProvider'
import React, { useEffect } from 'react'

const Home = ({ allData }: { allData: any }) => {
  const { data, projects, coursesData }: { data: any, projects: Project[], coursesData: { courses: CourseProps[], links: any[] } } = allData
  const { courses, links } = coursesData
  // hero props
  const hero: HeroProps = {
    heroProjectsButton: data.heroProjectsButton,
    heroBackground: data.heroBackground,
    heroCoursesButton: data.heroCoursesButton,
    heroDescription: data.heroDescription,
    heroTitle: data.heroTitle,
    heroProfileImage: data.heroProfileImage,
  }
  const about: AboutSectionProps = {
    aboutButton: data.aboutButton,
    aboutDescription: data.aboutDescription,
    aboutImages: data.aboutImages,
    aboutTitle: data.aboutTitle,
    aboutLabel: data.aboutLabel,
  }
  const projectsSectionProps: ProjectsSectionProps = {
    projects: projects,
    projectsDescription: data.projectsDescription,
    projectsLabel: data.projectsLabel,
    projectsTitle: data.projectsTitle,
  }
  const coursesSectionProps: CoursesSectionProps = {
    coursesTitle: data.coursesTitle,
    viewCourseButton: data.viewCourseButton,
    courses: courses,
    links: links,
    coursesLabel: data.coursesLabel
  }
  const achivements: AchivementsProps = {
    achivements: data.achivements,
    achivementsLabel: data.achivementsLabel,
    achivementsTitle: data.achivementsTitle,
    achivementsImage: data.achivementsImage
  }
  const reviews: StudentReviewsProps = {
    reviews: data.reviews,
    reviewsLabel: data.reviewsLabel,
    reviewsTitle: data.reviewsTitle
  }
  const services: ServicesSectionProps = {
    services: data.services,
    servicesLabel: data.servicesLabel,
    servicesTitle: data.servicesTitle,
    viewCardButtonText: data.viewCardButtonText
  }
  useEffect(() => {
    if (localStorage.getItem("scrollToSection")) {
      window.location.hash = `${localStorage.getItem("scrollToSection")}`
      const timeout = setTimeout(() => localStorage.removeItem("scrollToSection"), 100);
      return () => clearTimeout(timeout);
    }
  }, [])
  return (
    <PageContentProvider pageName='Home'>
      <div className=''>
        <Hero {...hero} />
        <AboutSection {...about} />
        <ServicesSection {...services} />
        <ProjectsSection {...projectsSectionProps} />
        <CoursesSection {...coursesSectionProps} />
        <AchivementsSection {...achivements} />
        <StudentReviews {...reviews} />
      </div>
    </PageContentProvider>
  )
}

export default Home
