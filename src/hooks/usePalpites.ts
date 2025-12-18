import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export function usePalpites() {
  return useQuery({
    queryKey: ["palpites"],
    queryFn: () => apiService.getPalpites(),
    enabled: false, // Only fetch when manually triggered
  });
}
