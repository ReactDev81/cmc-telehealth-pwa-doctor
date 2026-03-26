import { useQuery } from "@tanstack/react-query";
import { getDoctorHome } from "@/api/home";

export const useDoctorHome = () => {
  return useQuery({
    queryKey: ["doctor-home"],
    queryFn: getDoctorHome,
  });
};