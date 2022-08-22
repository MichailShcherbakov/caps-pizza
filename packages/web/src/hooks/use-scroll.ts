import React from "react";

export const useScroll = (options?: { onScrollChange: () => void }) => {
  const scrollToSection = React.useCallback((id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  React.useEffect(() => {
    if (!options?.onScrollChange) return;

    window.addEventListener("scroll", options.onScrollChange);

    return () => {
      window.removeEventListener("scroll", options.onScrollChange);
    };
  }, [options]);

  return React.useMemo(
    () => ({
      scrollToSection,
    }),
    [scrollToSection]
  );
};

export default useScroll;
