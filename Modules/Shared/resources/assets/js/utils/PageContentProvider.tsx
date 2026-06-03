import { createContext, ReactNode, useContext } from "react";

const PageContentContext = createContext<string>("");
export const usePageName = () => useContext(PageContentContext);
const PageContentProvider = ({ pageName, children }: { pageName: string, children: ReactNode }) => {
  return (
    <PageContentContext.Provider value={pageName}>
      {children}
    </PageContentContext.Provider>
  );
};
export default PageContentProvider;