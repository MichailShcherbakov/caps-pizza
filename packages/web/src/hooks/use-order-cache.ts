import React from "react";
import { useAppSelector } from "~/store/hooks";
import useOrderCacheActions from "./use-order-cache-actions";

export const useOrderCache = () => {
  const { write, loadFromStorage } = useOrderCacheActions();

  const cache = useAppSelector(state => state.orderCache.cache);

  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return React.useMemo(
    () => ({
      write,
      cache,
    }),
    [write, cache]
  );
};
