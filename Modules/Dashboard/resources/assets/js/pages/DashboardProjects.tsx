import DashboardLayout from "@dashboard/components/DashboardLayout";
import SearchHeader from "@dashboard/components/SearchHeader";
import { Link } from "@inertiajs/react";
import ProjectCard from "@projects/components/ProjectCard";
import { Project } from "@projects/interfaces";
import Button from "@shared/components/Button";
import Pagination from "@shared/components/Pagination";
import { useState } from "react";


const DashboardProjects = ({ allData }: { allData: any }) => {
  const { projects, links, content }: { projects: Project[], links: Array<any>, content: any } = allData;
  const [isSearching, setIsSearching] = useState(false);
  return (
    <DashboardLayout>
      <div className='max-lg:pt-48 py-10 pt-32 px-5'>
        <SearchHeader
          searchFields={content.searchFields}
          placeHolder={content.searchHeaderPlaceholder}
          onSearchModeChange={setIsSearching}
        />
        {
          !isSearching &&
          <Link href={content.addButton.link}
            className="block w-fit  mt-5 mb-10 mx-auto">
            <Button children={content.addButton.text} />
          </Link>
        }
        <div className='grid grid-cols-1 tab:grid-cols-2 xl:grid-cols-3   gap-6 mb-10'>
          {
            projects.map((project, i) => (
              <ProjectCard {...project} key={i} />
            ))
          }
        </div>
        <Pagination links={links} />
      </div>
    </DashboardLayout>
  )
}

export default DashboardProjects
