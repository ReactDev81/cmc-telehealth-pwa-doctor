// ✅ Prescription Detail API
import api from "@/lib/axios";

export const fetchPrescriptionByAppointmentId = async (appointmentId: string) => {
    const { data } = await api.get(`/prescriptions/detail/${appointmentId}`);

    console.log("Prescription detail data", data);

    return data;
};