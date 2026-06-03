import { Project } from "@projects/interfaces"

export type AboutSectionProps = {
  aboutTitle: string,
  aboutDescription: string,
  aboutImages: {
    image1: string,
    image2: string
  },
  aboutButton: {
    text: string,
    id: string
  },
  aboutLabel: string
}
export type ServiceProps = {
  title: string,
  description: string,
  icon: string,
  link: string
}
export type ServicesSectionProps = {
  servicesLabel: string,
  servicesTitle: string,
  services: ServiceProps[],
  viewCardButtonText: string
}
export type ProjectsSectionProps = {
  projectsTitle: string,
  projectsDescription: string,
  projectsLabel: string,
  projects: Project[]
}
export type TopicProps = {
  id: string
  title: string
}
export type LearningPointProps = {
  id: string
  title: string
}
export type CourseProps = {
  id: string,
  name: string,
  description: string,
  image: string,
  heroImage: string,
  price: string,
  topics: TopicProps[],
  learningPoints: LearningPointProps[],
  images: [{ image: string }],
  newCourse?: boolean
}
export type CoursesSectionProps = {
  coursesLabel: string,
  coursesTitle: string,
  viewCourseButton: {
    text: string,
    link: string
  },
  courses: CourseProps[],
  links: any[]
}
export type AchivementProps = {
  title: string,
  description: string
}
export type AchivementsProps = {
  achivementsTitle: string,
  achivementsLabel: string,
  achivements: AchivementProps[],
  achivementsImage: string
}
export type StudentReviewProps = {
  userName: string,
  userImage: string,
  userJob: string,
  description: string,
  stars: string
}
export type StudentReviewsProps = {
  reviewsLabel: string,
  reviewsTitle: string,
  reviews: StudentReviewProps[]
}
export type GlobalServicesProps = {
  services: { title: string, description: string, image: string }[],
  discoverButton: {
    link: string,
    text: string
  }
}