import { createInertiaApp, router } from "@inertiajs/react";
import { hydrateRoot } from "react-dom/client";
import ProjectLayout from "@shared/layouts/ProjectLayout";
import "../css/app.css";
import "./bootstrap";
import { ReactNode, useState, useEffect } from "react";
import LoadingSpinner from "@shared/components/LoadingSpinner";

type PageWithLayout = {
  default: React.ComponentType & { layout?: (page: ReactNode) => ReactNode };
};

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob("/Modules/**/resources/assets/js/pages/*.tsx", { eager: true });
    // @ts-ignore
    const pageModule = Object.entries(pages).find(([path]) => path.includes(`/${name}.tsx`))[1];
    const defaultLayout = (pageNode: ReactNode) => <ProjectLayout>{pageNode}</ProjectLayout>;
    const page = pageModule as PageWithLayout;
    if (!page.default.layout) {
      page.default.layout = defaultLayout;
    }
    return page;
  },

  setup({ el, App, props }) {
    function Root() {
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        const removeStart = router.on("start", () => setLoading(true));
        const removeFinish = router.on("finish", () => setLoading(false));
        const removeError = router.on("error", () => setLoading(false));
        const removeCancel = router.on("cancel", () => setLoading(false));

        return () => {
          removeStart();
          removeFinish();
          removeError();
          removeCancel();
        };
      }, []);

      return (
        <>
          {loading && <LoadingSpinner />}
          <App {...props} />
        </>
      );
    }

    hydrateRoot(el, <Root />)
  },

  progress: false,
  defaults: {
    visitOptions: () => ({ viewTransition: true }),
  },
});