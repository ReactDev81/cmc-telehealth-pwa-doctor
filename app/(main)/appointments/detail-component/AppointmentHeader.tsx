"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Video } from "lucide-react";

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
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {appointment?.status_label || "Completed"}
                        </Badge>

                        {/* Consultation */}
                        <Badge variant="outline" className="gap-1">
                            <Video className="h-3 w-3" />
                            {schedule?.consultation_type_label || "Video Consultation"}
                        </Badge>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}