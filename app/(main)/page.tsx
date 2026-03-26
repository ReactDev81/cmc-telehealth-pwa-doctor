// "use client";

// import StatsCard from "@/components/home/stats-card";
// import { useAuth } from "@/context/userContext";
// import { Calendar } from "lucide-react";

// const Home = () => {

//     const { user } = useAuth();

//     return (
//         <div className="flex flex-col gap-4">
//             <section>
//                 <h1 className="text-xl font-semibold mb-2">Welcome back, Dr. {user?.first_name}</h1>
//                 <p className="text-body">Here's what's happening with your practice today.</p>
//             </section>

//             <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <StatsCard title="Today Appointments" value={10} icon={<Calendar className="h-4 w-4" />} />
//             </section>
//         </div>
//     );
// }

// export default Home

"use client";

import StatsCard from "@/components/home/stats-card";
import AppointmentCard from "@/components/pages/appoitment/AppointmentCard";
import { useAuth } from "@/context/userContext";
import { useDoctorHome } from "@/queries/useHome";
import {
    Calendar,
    Clock3,
    XCircle,
    Loader2,
} from "lucide-react";

const Home = () => {

    const { user } = useAuth();
    const { data, isLoading, isError, error } = useDoctorHome();

    const dashboard = data?.data;
    console.log("DASHBOARD:", dashboard);
    const summary = dashboard?.summary;

    const stats = [
        {
            title: "Today Appointments",
            value: summary?.todays_appointments ?? 0,
            badgeText: "Today",
            icon: <Calendar className="h-4 w-4 text-[#0f5132]" />
        },
        {
            title: "Upcoming Appointments",
            value: summary?.upcoming_appointments ?? 0,
            badgeText: "Scheduled",
            icon: <Clock3 className="h-4 w-4 text-[#0f5132]" />
        },
        {
            title: "Cancelled Appointments",
            value: summary?.cancelled_appointments ?? 0,
            badgeText: "Missed",
            icon: <XCircle className="h-4 w-4 text-[#0f5132]" />
        },
        {
            title: "Average Ratings",
            value: summary?.average_review_score ?? 0,
            badgeText: "Avg",
            icon: <Clock3 className="h-4 w-4 text-[#0f5132]" />
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <section>
                <h1 className="mb-2 text-xl font-semibold">
                    Welcome back, Dr. {user?.first_name || dashboard?.first_name || "Doctor"}
                </h1>
                <p className="text-body">
                    Here's what's happening with your practice today.
                </p>
            </section>

            {isLoading ? (
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex h-[170px] items-center justify-center rounded-3xl border bg-muted/30"
                        >
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ))}
                </section>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {(error as any)?.response?.data?.message ||
                        (error as any)?.message ||
                        "Failed to load dashboard data."}
                </div>
            ) : (
                <>
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((card, index) => (
                            <StatsCard
                                key={index}
                                title={card.title}
                                value={card.value}
                                badgeText={card.badgeText}
                                icon={card.icon}
                            />
                        ))}
                    </section>

                    {/* Optional section: today's appointments */}
                    <section className="rounded-2xl border bg-white shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Today's Appointments</h2>
                            <span className="text-sm text-muted-foreground">
                                {dashboard?.todays_appointments?.length ?? 0} records
                            </span>
                        </div>

                        <div className="p-4">
                            {dashboard?.todays_appointments?.length ? (
                                <div className="space-y-3">
                                    {dashboard.todays_appointments.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            variant="today"
                                        />
                                        // <div
                                        //     key={appointment.id}
                                        //     className="flex items-center justify-between rounded-xl border p-4"
                                        // >
                                        //     <div>
                                        //         <h3 className="font-medium">{appointment.patient_name}</h3>
                                        //         <p className="text-sm text-muted-foreground">
                                        //             {appointment.date} • {appointment.time}
                                        //         </p>
                                        //     </div>

                                        //     <div className="text-right">
                                        //         <p className="text-sm font-medium capitalize">
                                        //             {appointment.consultation_type}
                                        //         </p>
                                        //         <p className="text-xs text-muted-foreground capitalize">
                                        //             {appointment.status}
                                        //         </p>
                                        //     </div>
                                        // </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No appointments for today.
                                </p>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Home;