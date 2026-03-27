// import { useQuery } from "@tanstack/react-query";
// import { getDoctorProfileByGroup } from "@/api/profile";
// import type { DoctorProfileGroup } from "@/types/profile";

// export const doctorProfileKeys = {
//   all: ["doctor-profile"] as const,
//   detail: (doctorID: string, group: DoctorProfileGroup) =>
//     [...doctorProfileKeys.all, doctorID, group] as const,
// };

// export const useDoctorProfile = <TGroup extends DoctorProfileGroup>(
//   doctorID: string,
//   group: TGroup
// ) => {
//   return useQuery({
//     queryKey: doctorProfileKeys.detail(doctorID, group),
//     queryFn: () => getDoctorProfileByGroup({ doctorID, group }),
//     enabled: !!doctorID,
//   });
// };

import { useQuery } from "@tanstack/react-query";
import { getDoctorProfileByGroup } from "@/api/profile";
import type { DoctorProfileGroup } from "@/types/profile";

export const doctorProfileKeys = {
  all: ["doctor-profile"] as const,
  byDoctor: (doctorID: string) => [...doctorProfileKeys.all, doctorID] as const,
  detail: (doctorID: string, group: DoctorProfileGroup) =>
    [...doctorProfileKeys.byDoctor(doctorID), group] as const,
};

export const useDoctorProfile = <TGroup extends DoctorProfileGroup>(
  doctorID: string,
  group: TGroup
) => {
  return useQuery({
    queryKey: doctorProfileKeys.detail(doctorID, group),
    queryFn: () => getDoctorProfileByGroup({ doctorID, group }),
    enabled: Boolean(doctorID && group),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};