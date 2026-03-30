"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Dot, Mail, Phone, Trash2, Video } from "lucide-react";
import { getStatusColor } from "@/src/utils/getStatusColor";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cancelAppointment } from "@/mutations/mange-appoitment";
import CustomDialog from "@/components/custom/Dialogboxs";
import { Separator } from "@/components/ui/separator";

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
    console.log(appointment);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localStatus, setLocalStatus] = useState(appointment?.status);
    const patient = appointment?.patient || {};
    const schedule = appointment?.schedule || {};
    const [successOpen, setSuccessOpen] = useState(false);

    const handleCancelAppointment = async () => {
        try {
            setLoading(true);
            const appointmentId = appointment?.appointment_id || appointment?.id;

            const res = await cancelAppointment(appointmentId);

            setLocalStatus("cancelled");
            setOpen(false);
            setSuccessOpen(true);
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.errors?.message ||
                error?.response?.data?.message ||
                "Something went wrong";

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm rounded-2xl border">
            <CardContent >
                <div className="flex flex-col w-full gap-4">
                    {/* Left side - Avatar and Info */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between flex-wrap gap-4">

                            <div className="flex items-center text-lg  flex-wrap gap-2">


                                <div className="flex items-center gap-1">
                                    <p className="mt-0.5  flex items-center font-bold">
                                        {schedule?.date_format ||
                                            appointment?.appointment_date_format} <span className="opacity-50 px-1"> | </span>
                                        {schedule?.time_formatted ||
                                            appointment?.appointment_time_formatted}
                                        {appointment?.appointment_end_time_formatted &&
                                            ` - ${appointment.appointment_end_time_formatted}`} <span className="opacity-50"><Dot className="h-7" /></span>

                                        {schedule?.day_format ||
                                            appointment?.appointment_date_format}
                                    </p>
                                </div>

                                <Badge
                                    className={`${getStatusColor(
                                        "appointment",
                                        localStatus
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

                            <div>
                                {!successOpen &&
                                    ["confirmed", "rescheduled"].includes(appointment?.status) && (
                                        <Button
                                            variant="default"
                                            className="bg-red-700"
                                            onClick={() => setOpen(true)}
                                            disabled={loading}
                                        >
                                            {loading ? "Cancelling..." : "Cancel Appointment"}
                                        </Button>
                                    )}
                            </div>
                        </div>

                        {/* Separator - Now takes full width */}
                        <Separator className="w-full opacity-50" />

                        {/* Avatar */}
                        <div className="flex items-center gap-2">
                            <Avatar className="h-14 w-14 border-2 border-primary/10">
                                <AvatarImage src={patient?.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {getInitials(patient?.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex flex-col gap-1">
                                {/* Name */}
                                <div className="flex gap-1">
                                    <h2 className="text-base leading-none">
                                        {patient?.name || "Unknown Patient"}
                                    </h2>
                                    <span>
                                        ({patient?.age_formatted || "N/A"},{" "}
                                        {patient?.gender_formatted || "N/A"}
                                        )
                                    </span>
                                </div>
                                {/* Meta Row */}
                                <div className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
                                    {/* Age + Gender */}
                                    <p className="text-sm font-medium flex items-center gap-1">
                                        <Phone className="h-3 w-3" /> {patient?.phone || "Not provided"}
                                    </p> |
                                    <p className="text-sm font-medium flex items-center gap-1">
                                        <Mail className="h-3 w-3" /> {patient?.email || "Not provided"}
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Button */}

                </div>

                {/* Cancel Dialog */}
                <CustomDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    title="Cancel Appointment"
                    description="Are you sure you would like to do this?"
                    confirmText={loading ? "Cancelling..." : "Yes, Cancel Appointment"}
                    cancelText="No, Keep Appointment"
                    onConfirm={handleCancelAppointment}
                    loading={loading}
                    type="danger"
                />

                {/* Success Dialog */}
                <CustomDialog
                    open={successOpen}
                    onClose={() => setSuccessOpen(false)}
                    icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                    title="Appointment Cancelled"
                    description="Your appointment has been successfully cancelled."
                    confirmText="OK"
                    onConfirm={() => setSuccessOpen(false)}
                    type="success"
                />
            </CardContent>
        </Card>
    );
}