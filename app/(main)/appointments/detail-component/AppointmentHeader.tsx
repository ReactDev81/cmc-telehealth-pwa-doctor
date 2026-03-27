"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Video } from "lucide-react";
import { getStatusColor } from "@/src/utils/getStatusColor";

const getInitials = (name: string) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default function AppointmentHeader({ appointment }: { appointment: any }) {
    const patient = appointment?.patient || {};
    const schedule = appointment?.schedule || {};

    return (
        <Card className="shadow-sm rounded-2xl border">
            <CardContent className="p-5 flex items-center gap-4">

                {/* Avatar */}
                <Avatar className="h-14 w-14 border-2 border-primary/10">
                    <AvatarImage src={patient?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(patient?.name)}
                    </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex flex-col gap-2">

                    {/* Name */}
                    <h2 className="text-xl font-semibold leading-none">
                        {patient?.name || "Unknown Patient"}
                    </h2>

                    {/* Meta Row */}
                    <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">

                        {/* Age + Gender */}
                        <span>
                            {patient?.age_formatted || "N/A"},{" "}
                            {patient?.gender_formatted || "N/A"}
                        </span>

                        {/* Status */}
                        <Badge
                            className={`${getStatusColor(
                                "appointment",
                                appointment?.status
                            )} gap-1`}
                        >
                            {appointment?.status_label || "Completed"}
                        </Badge>

                        {/* Consultation */}
                        <Badge variant="outline" className="gap-1">
                            <Video className="h-3 w-3" />
                            {schedule?.consultation_type_label || "Video Consultation"}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                            <p className="font-medium mt-0.5">
                                {schedule?.date_formatted || appointment?.appointment_date_formatted}
                            </p>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 mt-5">
                        <span className="font-medium">|</span>

                        <p className="font-medium">
                            {schedule?.time_formatted || appointment?.appointment_time_formatted}
                            {appointment?.appointment_end_time_formatted &&
                                ` - ${appointment.appointment_end_time_formatted}`}
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}