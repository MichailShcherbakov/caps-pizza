import React from "react";

export let setCurrentActiveSection: (name: string) => void;

export const useCurrentSection = () => {
  return React.useContext(SectionContext);
};

export interface SectionContextType {
  currentActiveSectionName: string | null;
}

export const SectionContext = React.createContext<SectionContextType>({
  currentActiveSectionName: null,
});

export const SectionProvider = ({ children }: any) => {
  const [ctx, setCtx] = React.useState<SectionContextType>({
    currentActiveSectionName: null,
  });

  setCurrentActiveSection = (name: string) => {
    setCtx({
      currentActiveSectionName: name,
    });
  };

  return (
    <SectionContext.Provider value={ctx}>{children}</SectionContext.Provider>
  );
};
