import { useQuery } from "@tanstack/react-query";
import { getMedicines } from "@/api/medicines";

interface UseMedicinesParams {
  page: number;
  per_page: number;
  search: string;
}

export const useMedicines = ({
  page,
  per_page,
  search,
}: UseMedicinesParams) => {
  return useQuery({
    queryKey: ["medicines", page, per_page, search],
    queryFn: () =>
      getMedicines({
        page,
        per_page,
        search,
      }),
    placeholderData: (previousData) => previousData,
    select: (data) => data.data || [],
  });
};
