import React from "react";
import { useAppDispatch } from "~/store/hooks";
import {
  write,
  setMetaStep,
  OrderCacheState,
} from "~/store/reducers/order-cache.reducer";

export const useOrderCacheActions = () => {
  const dispatch = useAppDispatch();

  return React.useMemo(
    () => ({
      loadFromStorage: () => {
        dispatch(setMetaStep({ step: "pending" }));
      },
      write: (cache: Pick<OrderCacheState, "cache">) => {
        dispatch(write(cache));
      },
    }),
    [dispatch]
  );
};

export default useOrderCacheActions;
