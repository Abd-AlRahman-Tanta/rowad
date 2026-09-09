import BlogCard from "@blogs/components/BlogCard"
import { BlogProps } from "@blogs/interfaces"
import Hero from "@shared/components/Hero"
import Label from "@shared/components/Label"
import MainTitle from "@shared/components/MainTitle"
import Pagination from "@shared/components/Pagination"
import { Animations } from "@shared/layouts/ProjectLayout"
import EditableText from "@shared/utils/EditableText"
import PageContentProvider from "@shared/utils/PageContentProvider"
import { useContext } from "react"
import { useInView } from "react-intersection-observer"

const BlogsPage = ({ allData }: { allData: any }) => {
  const { data, blogs, links } = allData

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const anim = useContext(Animations)
  const pTitle = anim?.animProps(inView, { delay: 0, duration: 800, variant: 'fadeUp' })

  const hero = {
    heroBackground: data.heroBackground,
    heroTitle: data.heroTitle,
    heroDescription: data.heroDescription,
  }

  return (
    <PageContentProvider pageName="BlogsPage">
      <div>
        {/* Hero */}
        <Hero {...hero} />

        {/* Blogs Grid */}
        <div ref={ref} className="py-20 px-largeSaveSpace max-desc:px-mobSaveSpace bg-arch-accent/10">

          {/* Header */}
          <div className="mb-14">
            <Label path="blogsLabel" title={data.blogsLabel} />
            <EditableText
              path="blogsTitle"
              text={data.blogsTitle}
              className={`w-fit ${pTitle?.className ?? ''}`}
              style={pTitle?.style}
            >
              <MainTitle black>{data.blogsTitle}</MainTitle>
            </EditableText>
          </div>

          {/* Cards */}
          <div className="w-full flex flex-wrap justify-center gap-8">
            {blogs.map((blog: BlogProps, index: number) => {
              const pCard = anim?.animProps(inView, {
                delay: 140 + (index % 6) * 90,
                duration: 850,
                variant: index % 2 === 0 ? 'fadeUp' : 'fadeDown',
              })
              return (
                <BlogCard
                  key={blog.id}
                  {...blog}
                  anim={pCard}
                  viewBlogButton={data.viewBlogButton}
                />
              )
            })}
          </div>

          {/* Pagination */}
          <div className="mt-14 flex justify-center">
            <Pagination links={links} />
          </div>
        </div>
      </div>
    </PageContentProvider>
  )
}

export default BlogsPage