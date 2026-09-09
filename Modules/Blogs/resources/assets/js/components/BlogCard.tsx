import { BlogProps } from "@blogs/interfaces";
import { Link, usePage } from "@inertiajs/react";
import Image from "@shared/components/Image";
import SectionTitle from "@shared/components/SectionTitle";

type AnimProps = { className: string; style: React.CSSProperties }

type BlogCardProps = BlogProps & {
  viewBlogButton?: { text: string; link: string }
  anim?: AnimProps
}

const BlogCard = ({
  id,
  image,
  title,
  summary,
  category,
  readTime,
  created_at,
  viewBlogButton,
  anim,
}: BlogCardProps) => {
  const { locale, url } = usePage().props as any
  const { url: pageUrl } = usePage()
  const isDashboard = pageUrl.includes('dashboard')

  const titleText = typeof title === 'object' ? title[locale as 'ar' | 'en'] : title
  const summaryText = typeof summary === 'object' ? summary[locale as 'ar' | 'en'] : summary

  return (
    <div
      className={`
        ${isDashboard ? 'w-full' : 'desc:w-[30%] desc:grow max-desc:w-full max-desc:max-w-[calc((100%-32px)/2)] max-mob:max-w-full'}
        bg-arch-card
        rounded-3xl
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
        border border-gray-100
        group
        flex flex-col
        ${anim?.className ?? ''}
      `}
      style={anim?.style}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden">
        <Image
          src={image}
          className="h-56 w-full object-cover group-hover:scale-105 transition-all duration-500"
        />
        {category && (
          <div className="absolute top-4 start-4 bg-arch-accent text-arch-light text-xs px-3 py-1 rounded-full font-semibold shadow">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-3 grow">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-arch-gray">
          {created_at && (
            <span className="flex items-center gap-1">
              <span>📅</span>
              {created_at}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1">
              <span>⏱</span>
              {readTime}
            </span>
          )}
        </div>

        {/* Title */}
        <SectionTitle className="text-lg font-bold text-arch-dark leading-5 line-clamp-2">
          {titleText}
        </SectionTitle>

        {/* Summary */}
        <p
          className="text-arch-gray text-sm leading-4 line-clamp-3 grow"
          dangerouslySetInnerHTML={{ __html: summaryText }}
        />

        {/* Button */}
        {viewBlogButton && (
          <Link
            href={viewBlogButton.link + id}
            className="mt-2 inline-flex items-center gap-2 text-arch-accent font-semibold text-sm hover:gap-3 transition-all duration-300"
          >
            {viewBlogButton.text}
            <span className="text-base">←</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default BlogCard