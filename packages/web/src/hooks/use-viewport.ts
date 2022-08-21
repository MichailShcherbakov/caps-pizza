import React from "react";

export const useViewport = () => {
  const isInViewport = React.useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top - window.innerHeight / 2 <= 0 &&
      -rect.top <= rect.height - window.innerHeight / 2
    );
  }, []);

  return { isInViewport };
};

export default useViewport;
