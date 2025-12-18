import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export function useResultados() {
  return useQuery({
    queryKey: ["resultados"],
    queryFn: () => apiService.getResultados(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
