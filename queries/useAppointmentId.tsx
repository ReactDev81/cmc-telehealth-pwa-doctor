import { fetchAppointmentById } from "@/api/appoitments";
import { useQuery } from "@tanstack/react-query";

export const useAppointmentById = (id: string) => {
    return useQuery({
        queryKey: ["appointment", id],
        queryFn: () => fetchAppointmentById(id),
        enabled: !!id, // id hone par hi call hogi
    });
};