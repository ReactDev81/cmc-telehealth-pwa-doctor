"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trash2, Video } from "lucide-react";
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
import { Button } from "@/components/ui/button"; // Make sure to import Button
import { cancelAppointment } from "@/mutations/mange-appoitment";
import CustomDialog from "@/components/custom/Dialogboxs";

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
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localStatus, setLocalStatus] = useState(appointment?.status);
    const patient = appointment?.patient || {};
    const schedule = appointment?.schedule || {};
    const [successOpen, setSuccessOpen] = useState(false);

    const handleCancelAppointment = async () => {
        try {
            const appointmentId = appointment?.appointment_id || appointment?.id;

            const res = await cancelAppointment(appointmentId);

            setLocalStatus("cancelled");

            // ✅ 1. Close confirm dialog
            setOpen(false);

            // ✅ 2. Open success dialog
            setSuccessOpen(true);

        } catch (error: any) {
            console.log("ERROR:", error?.response?.data);

            const errorMessage =
                error?.response?.data?.errors?.message ||
                error?.response?.data?.message ||
                "Something went wrong";

            toast.error(errorMessage);
        }
    };

    return (
        <Card className="shadow-sm rounded-2xl border">
            <CardContent className="p-5 flex items-center justify-between gap-4">
                {/* Left side - Avatar and Info */}
                <div className="flex items-center gap-4">
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
                    </div>
                </div>

               
                {!successOpen &&
                    ["confirmed", "rescheduled"].includes(appointment?.status) && (
                        <Button
                            variant="link"
                            className="text-destructive font-semibold"
                            onClick={() => setOpen(true)}
                        >
                            Do you want to cancel this appointment?
                        </Button>
                    )}

                {/* Cancel Dialog */}
                <CustomDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    icon={<Trash2 className="h-6 w-6 text-red-500" />}
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

//  <Button variant="outline" onClick={() => setOpen(false)}>
//                                     No, Keep Appointment
//                                 </Button>
//                                 <Button variant="destructive" onClick={handleCancelAppointment} disabled={loading}>
//                                     {loading ? "Cancelling..." : "Yes, Cancel Appointment"}
//                                 </Button>