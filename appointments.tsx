// import api from "@/lib/axios";
// import { Appointment } from "@/types/appointment";


// export const fetchAppointments = async (
//     filter: "today" | "upcoming" | "past",
//     token: string
// ): Promise<Appointment[]> => {

//     try {
//         const res = await api.get<any>(
//             `/appointments/my?filter=${filter}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         const extract = (obj: any): Appointment[] => {

//             if (!obj) return [];

//             // If the object itself is an array, return it
//             if (Array.isArray(obj)) return obj;

//             // Check common data keys
//             const dataKeys = ["data", "list", "items", "appointments"];
//             for (const key of dataKeys) {
//                 if (obj[key] && Array.isArray(obj[key])) {
//                     return obj[key];
//                 }
//             }

//             // Check if data is nested under data.data (happens in some responses)
//             if (obj.data && typeof obj.data === 'object' && obj.data.data && Array.isArray(obj.data.data)) {
//                 return obj.data.data;
//             }

//             // Recursive search for an array if not found in common keys
//             for (const key in obj) {
//                 if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
//                     const nested = extract(obj[key]);
//                     if (nested.length > 0) return nested;
//                 }
//             }

//             return [];
//         };

//         const finalData = extract(res.data);
//         return finalData;
//     } catch (error: any) {
//         if (error.response) {
//             console.error(`[API] ${error.response.status} error fetching ${filter} appointments:`, JSON.stringify(error.response.data, null, 2));
//         } else {
//             console.error(`[API] Error fetching ${filter} appointments:`, error.message);
//         }
//         return [];
//     }
// };

// export const markAppointmentAsCompleted = async (
//     appointmentId: string,
//     token: string
// ): Promise<any> => {

//     const response = await api.post(`/appointments/${appointmentId}/mark-as-completed`,
//         {
//             status: "completed",
//             is_complete: true
//         },
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//             },
//         }
//     );
//     return response.data;
// };