"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MapPin,
    PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AppointmentCardProps {
    appointment: any;
    variant?: "today" | "upcoming" | "past" | "all";
    onCallNow?: () => void;
}

// ✅ Status Color Mapping (using global classes)
const getStatusColor = (status: string) => {
    switch (status) {
        case "confirmed":
            return "status-confirmed";
        case "failed":
            return "status-failed";
        case "completed":
            return "status-completed";
        case "pending":
            return "status-pending";
        default:
            return "status-default";
    }
};

// ✅ Consultation Icon
const getConsultationIcon = (type: string) => {
    switch (type) {
        case "video":
            return <Video className="h-3.5 w-3.5" />;
        case "phone":
            return <Phone className="h-3.5 w-3.5" />;
        case "in-person":
        case "clinic":
            return <MapPin className="h-3.5 w-3.5" />;
        default:
            return <Video className="h-3.5 w-3.5" />;
    }
};

// ✅ Initials fallback
const getInitials = (name: string) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default function AppointmentCard({
    appointment,
    variant = "all",
    onCallNow,
}: AppointmentCardProps) {
    const showCallNow = appointment.call_now === true;

    const router = useRouter();

    console.log("CLICK ID:", appointment.appointment_id);

    return (
        <Card className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <CardContent>
                {/* 🔹 Header */}
                <div className="flex gap-3">

                    {/* Avatar */}
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/10">
                        <AvatarImage
                            src={appointment.patient?.avatar || ""}
                            alt={appointment.patient?.name || "Patient"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(appointment.patient?.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-2 flex-nowrap">

                            {/* Left */}
                            <div className="flex-1 min-w-0">
                                <h3 >
                                    {appointment.patient?.name || "Unknown Patient"}
                                </h3>

                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                    <Badge
                                        variant="outline"
                                        className="gap-1 text-xs font-medium px-2 py-0.5 shrink-0"
                                    >
                                        {getConsultationIcon(appointment.consultation_type)}
                                        <span>
                                            {appointment.consultation_type === "clinic"
                                                ? "In-Person"
                                                : appointment.consultation_type_label?.split(" ")[0] ||
                                                "Video"}
                                        </span>
                                    </Badge>
                                </div>
                            </div>



                            {showCallNow ? (
                                <Badge
                                    className="bg-success text-success-foreground hover:opacity-90 cursor-pointer shrink-0 gap-1.5 px-2.5 py-1 text-xs font-medium"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCallNow?.();
                                    }}
                                >
                                    <PhoneCall className="h-3 w-3" />
                                    Join Now
                                </Badge>
                            ) : (
                                <Badge
                                    className={`${getStatusColor(
                                        appointment.status
                                    )} text-xs font-medium px-2 py-0.5 whitespace-nowrap`}
                                >
                                    {appointment.status_label}
                                </Badge>
                            )
                            }
                        </div >
                    </div >
                </div >
                {/* 

                {/* 🔹 Date & Time */}
                <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-small">
                            {appointment.appointment_date_formatted ||
                                appointment.appointment_date}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-small">
                            {appointment.appointment_time_formatted ||
                                appointment.appointment_time}
                            {appointment.appointment_end_time_formatted &&
                                ` - ${appointment.appointment_end_time_formatted}`}
                        </span>
                    </div>
                </div>

                {/* 🔹 Actions */}
                <div className="flex gap-3 mt-4 items-stretch">
                    <Button
                        className="flex-1 h-9"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/appointments/${appointment.appointment_id}`);
                        }}
                    >
                        View
                    </Button>

                    {/* ✅ Hide for rescheduled + failed */}
                    {appointment.status !== "rescheduled" &&
                        appointment.status !== "failed" && (
                            <Button className="flex-1 h-9" variant="outline">
                                Reschedule
                            </Button>
                        )}
                </div>
            </CardContent >
        </Card >
    );
}