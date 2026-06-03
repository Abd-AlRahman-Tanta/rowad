import { createInertiaApp } from '@inertiajs/react'
import createServer from "@inertiajs/react/server"
import ProjectLayout from '@shared/layouts/ProjectLayout'
import type { ReactNode } from 'react'
import ReactDOMServer from "react-dom/server"
createServer(
  (page) =>
    createInertiaApp({
      page,
      render: ReactDOMServer.renderToString,

      resolve: name => {
        const pages = import.meta.glob(
          "/Modules/**/resources/assets/js/pages/*.tsx",
          { eager: true }
        )

        const pageModule = Object.entries(pages)
          .find(([path]) => path.includes(`/${name}.tsx`))?.[1]

        if (!pageModule) throw new Error(`Page not found: ${name}`)

        // @ts-ignore
        pageModule.default.layout = (p: ReactNode) => (
          <ProjectLayout>{p}</ProjectLayout>
        )

        return pageModule
      },

      setup: ({ App, props }) => <App {...props} />,
    }),
  { cluster: true },
)
