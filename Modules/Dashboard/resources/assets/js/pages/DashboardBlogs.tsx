import { BlogProps } from "@blogs/interfaces"
import DashboardLayout from "@dashboard/components/DashboardLayout"
import SearchHeader from "@dashboard/components/SearchHeader"
import { Link, usePage } from "@inertiajs/react"
import Button from "@shared/components/Button"
import Image from "@shared/components/Image"
import Pagination from "@shared/components/Pagination"
import { useState } from "react"

const DashboardBlogs = ({ allData }: { allData: any }) => {
  const { blogs, links, content } = allData
  const [isSearching, setIsSearching] = useState(false)
  const { locale } = usePage().props as any

  return (
    <DashboardLayout>
      <div className="max-lg:pt-48 py-10 pt-32 px-5">
        <SearchHeader
          searchFields={content.searchFields}
          placeHolder={content.searchHeaderPlaceholder}
          onSearchModeChange={setIsSearching}
        />

        {!isSearching && (
          <Link
            href={content.addButton.link}
            className="block w-fit mt-5 mb-10 mx-auto"
          >
            <Button children={content.addButton.text} />
          </Link>
        )}

        <div className="grid grid-cols-1 tab:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {blogs.map((blog: BlogProps) => {
            const titleText = typeof blog.title === 'object'
              ? blog.title[locale as 'ar' | 'en']
              : blog.title

            return (
              <Link
                key={blog.id}
                href={`/${locale}/dashboard/blogs/${blog.id}/edit`}
                className="bg-arch-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={blog.image}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  {blog.category && (
                    <span className="absolute top-3 start-3 bg-arch-accent text-arch-light text-xs px-3 py-1 rounded-full font-semibold">
                      {blog.category}
                    </span>
                  )}
                  {blog.published === false && (
                    <span className="absolute top-3 end-3 bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {locale === 'ar' ? 'مسودة' : 'Draft'}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 grow">
                  <p className="text-xs text-arch-gray">{blog.created_at}</p>
                  <h3 className="font-bold text-arch-dark text-base leading-5 line-clamp-2">
                    {titleText}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>

        <Pagination links={links} />
      </div>
    </DashboardLayout>
  )
}

export default DashboardBlogs