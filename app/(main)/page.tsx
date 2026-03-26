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

"use client";

import StatsCard from "@/components/home/stats-card";
import AppointmentCard from "@/components/pages/appoitment/AppointmentCard";
import { useAuth } from "@/context/userContext";
import { useDoctorHome } from "@/queries/useHome";
import { useNotifications, useReadNotification } from "@/queries/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Clock3,
    XCircle,
    Loader2,
    Users,
    MessageSquare,
    CreditCard,
    Star,
    Bell,
    FileText,
    CalendarCheck,
    Star as StarIcon
} from "lucide-react";
import QuickActionsCard, { QuickActionItem } from "@/components/home/quick-actions-card";
import NotificationsCardContent from "@/components/ui/notifications-card-content";

const Home = () => {

    const { user } = useAuth();
    const router = useRouter();
    const { data, isLoading, isError, error } = useDoctorHome();
    const { 
        data: notificationsData, 
        isLoading: notificationsLoading, 
        error: notificationsError 
    } = useNotifications();
    const { mutate: markAsRead } = useReadNotification();

    const dashboard = data?.data;
    console.log("DASHBOARD:", dashboard);
    const summary = dashboard?.summary;
    const notifications = notificationsData?.data || [];

    const getNotificationIcon = (group: string) => {
        switch (group) {
            case "appointment":
                return <CalendarCheck className="h-4 w-4" />;
            case "review":
                return <StarIcon className="h-4 w-4" />;
            case "document":
                return <FileText className="h-4 w-4" />;
            case "availability":
                return <Bell className="h-4 w-4" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

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

    const quickActions: QuickActionItem[] = [
        {
            id: 1,
            title: "All Patients",
            icon: <Calendar className="h-6 w-6 text-primary" />,
            href: "/doctor/dashboard/all-patients",
        },
        {
            id: 2,
            title: "Patient Reports",
            icon: <Users className="h-6 w-6 text-primary" />,
            href: "/doctor/dashboard/reports",
        },
        {
            id: 3,
            title: "Medicine Inventory",
            icon: <MessageSquare className="h-6 w-6 text-primary" />,
            href: "/doctor/dashboard/inventory",
        },
        {
            id: 4,
            title: "Payment History",
            icon: <CreditCard className="h-6 w-6 text-primary" />,
            href: "/doctor/dashboard/payments",
        },
        {
            id: 5,
            title: "All Reviews",
            icon: <Star className="h-6 w-6 text-primary" />,
            href: "/doctor/dashboard/reviews",
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <section>
                <h1 className="mb-2 text-xl font-medium">
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
                    <section className="flex gap-4">
                        <div className="flex-1 rounded-2xl border bg-white shadow-sm">
                            <div className="flex flex-col p-4 border-b">
                                <h2 className="text-lg font-medium">Today's Appointments</h2>
                                <span className="text-sm text-muted-foreground">
                                    You have {dashboard?.todays_appointments?.length ?? 0} appointments scheduled
                                </span>
                            </div>

                            <div className="p-4">
                                {dashboard?.todays_appointments?.length ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            {dashboard.todays_appointments.slice(0, 3).map((appointment) => (
                                                <AppointmentCard
                                                    key={appointment.id}
                                                    appointment={appointment}
                                                    variant="today"
                                                />
                                            ))}
                                        </div>
                                        {dashboard.todays_appointments.length > 3 && (
                                            <div className="mt-4 text-center">
                                                <Link
                                                    href="/appointments"
                                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                                >
                                                    View All ({dashboard.todays_appointments.length})
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No appointments for today.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="min-w-[30%] rounded-2xl border bg-white shadow-sm">
                            <div className="flex flex-col p-4 border-b">
                                <h2 className="text-lg font-medium">Notifications</h2>
                                <span className="text-sm text-muted-foreground">
                                    You have {notificationsData?.meta?.total_unread ?? 0} unread notifications
                                </span>
                            </div>
                            <div>
                                <NotificationsCardContent
                                    notifications={notifications}
                                    loading={notificationsLoading}
                                    error={notificationsError?.message || null}
                                    limit={3}
                                    onClickItem={(id) => markAsRead(id)}
                                    onViewAll={() => router.push("/doctor/notifications")}
                                    getIcon={(group) => getNotificationIcon(group)}
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <QuickActionsCard actions={quickActions} />
                    </section>
                </>
            )}
        </div>
    );
};

export default Home;