import BlogCard from "@blogs/components/BlogCard"
import { BlogProps } from "@blogs/interfaces"
import { usePage } from "@inertiajs/react"
import Image from "@shared/components/Image"
import Label from "@shared/components/Label"
import MainTitle from "@shared/components/MainTitle"
import { Animations } from "@shared/layouts/ProjectLayout"
import EditableText from "@shared/utils/EditableText"
import PageContentProvider from "@shared/utils/PageContentProvider"
import { useContext } from "react"
import { useInView } from "react-intersection-observer"


const BlogDetailsPage = ({ allData }: { allData: any }) => {
  const { data, blog, moreBlogs } = allData
  const { locale } = usePage().props as any
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const anim = useContext(Animations)

  const pCard = anim?.animProps(inView, { delay: 0, duration: 900, variant: 'zoom' })
  const pLeft = anim?.animProps(inView, { delay: 100, duration: 850, variant: 'fadeUp' })
  const pMore = anim?.animProps(inView, { delay: 0, duration: 850, variant: 'fadeUp' })

  const titleText = blog.title?.[locale] ?? ''
  const contentText = blog.content?.[locale] ?? ''

  return (
    <PageContentProvider pageName="BlogsPage">
      <div ref={ref} className="pb-20 pt-32 relative bg-arch-accent/10 min-h-screen">

        {/* Hero Background */}
        {blog.heroImage && (
          <Image
            className="w-full h-[60vh] object-cover absolute inset-0 opacity-30"
            src={blog.heroImage}
          />
        )}

        <div className="relative z-10 px-largeSaveSpace max-desc:px-mobSaveSpace">

          {/* Blog Card */}
          <div
            className={`bg-arch-card rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto ${pCard?.className ?? ''}`}
            style={pCard?.style}
          >
            {/* Cover Image */}
            <Image
              src={blog.image}
              className="w-full aspect-[2] object-cover"
            />

            <div className={`p-10 max-mob:p-6 ${pLeft?.className ?? ''}`} style={pLeft?.style}>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-arch-gray">
                {blog.category && (
                  <span className="bg-arch-accent/10 text-arch-accent px-3 py-1 rounded-full font-semibold text-xs">
                    {blog.category}
                  </span>
                )}
                {blog.created_at && (
                  <span className="flex items-center gap-1">📅 {blog.created_at}</span>
                )}
                {blog.readTime && (
                  <span className="flex items-center gap-1">⏱ {blog.readTime}</span>
                )}
              </div>

              {/* Title */}
              <MainTitle black className="mb-6 leading-4">
                {titleText}
              </MainTitle>

              {/* Divider */}
              <div className="w-16 h-1 bg-arch-accent rounded-full mb-8" />

              {/* Content */}
              <div
                className="text-arch-charcoal leading-4 text-lg prose max-w-none"
                dangerouslySetInnerHTML={{ __html: contentText }}
              />
            </div>
          </div>

          {/* More Blogs Section */}
          {moreBlogs?.blogs?.length > 0 && (
            <div className="mt-24">
              <div className={`mb-14 ${pMore?.className ?? ''}`} style={pMore?.style}>
                <Label title={data.showMoreLabel} path="showMoreLabel" />
                <EditableText
                  text={data.showMoreTitle}
                  path="showMoreTitle"
                  className="w-fit"
                >
                  <MainTitle black>{data.showMoreTitle}</MainTitle>
                </EditableText>
              </div>

              <div className="w-full flex flex-wrap justify-center gap-8">
                {moreBlogs.blogs.map((b: BlogProps, index: number) => {
                  const pBlog = anim?.animProps(inView, {
                    delay: 100 + index * 100,
                    duration: 850,
                    variant: index % 2 === 0 ? 'fadeUp' : 'fadeDown',
                  })
                  return (
                    <BlogCard
                      key={b.id}
                      {...b}
                      anim={pBlog}
                      viewBlogButton={data.viewBlogButton}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContentProvider>
  )
}

export default BlogDetailsPage