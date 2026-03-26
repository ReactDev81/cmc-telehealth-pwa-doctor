"use client";

import {
    Calendar,
    Clock,
    Video,
    Mail,
    Phone,
    Droplet,
    User,
    IndianRupee,
    CheckCircle,
    FileText,
    XCircle,
    CreditCard,
    MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function OverviewTab({ appointment }: { appointment: any }) {
    const patient = appointment?.patient || {};
    const doctor = appointment?.doctor || {};
    const schedule = appointment?.schedule || {};
    const payment = appointment?.payment || {};

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return {
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                    badgeClass: "bg-green-100 text-green-700 hover:bg-green-100",
                    smallIcon: <CheckCircle className="h-3 w-3 mr-1" />,
                };

            case "confirmed":
                return {
                    icon: <Calendar className="h-4 w-4 text-blue-500" />,
                    badgeClass: "bg-blue-100 text-blue-700 hover:bg-blue-100",
                    smallIcon: <Calendar className="h-3 w-3 mr-1" />,
                };

            case "cancelled":
            case "failed":
                return {
                    icon: <XCircle className="h-4 w-4 text-red-500" />,
                    badgeClass: "bg-red-100 text-red-700 hover:bg-red-100",
                    smallIcon: <XCircle className="h-3 w-3 mr-1" />,
                };

            case "pending":
                return {
                    icon: <Clock className="h-4 w-4 text-yellow-500" />,
                    badgeClass: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                    smallIcon: <Clock className="h-3 w-3 mr-1" />,
                };

            default:
                return {
                    icon: <Clock className="h-4 w-4 text-gray-400" />,
                    badgeClass: "bg-gray-100 text-gray-700",
                    smallIcon: <Clock className="h-3 w-3 mr-1" />,
                };
        }
    };

    const statusConfig = getStatusConfig(appointment?.status);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">



            {/* LEFT SIDE */}
            <div className="xl:col-span-2 space-y-6">

                {/* Patient Problem */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            📄 Patient Problem / Chief Complaint
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {patient?.problem ||
                                patient?.chief_complaint ||
                                "No problem/complaint recorded"}
                        </p>
                    </CardContent>
                </Card>

                {/* Appointment Details */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-base font-semibold">Appointment Details</span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}

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
                                <div className="flex gap-3 mt-5">
                                   
                                    <div>
                                        <p className="font-medium">
                                            {schedule?.time_formatted || appointment?.appointment_time_formatted}
                                            {appointment?.appointment_end_time_formatted &&
                                                ` - ${appointment.appointment_end_time_formatted}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Consultation Type */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    {schedule?.consultation_type === "video" ? (
                                        <Video className="h-4 w-4 text-primary" />
                                    ) : schedule?.consultation_type === "phone" ? (
                                        <Phone className="h-4 w-4 text-primary" />
                                    ) : (
                                        <MapPin className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Consultation Type</p>
                                    <p className="font-medium mt-0.5">
                                        {schedule?.consultation_type_label || appointment?.consultation_type_label}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    {statusConfig.icon}
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Status
                                    </p>

                                    <div className="mt-0.5">
                                        <Badge className={statusConfig.badgeClass}>
                                            {statusConfig.smallIcon}
                                            {appointment?.status_label}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Type */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Booking Type</p>
                                    <p className="font-medium mt-0.5">
                                        {schedule?.booking_type || "Online"}
                                    </p>
                                </div>
                            </div>

                            {/* Can Reschedule */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Can Reschedule</p>
                                    <div className="mt-0.5">
                                        {appointment?.can_reschedule ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Yes
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                No
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info - Duration (if available) */}
                            {appointment?.appointment_time && appointment?.appointment_end_time && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                                        <p className="font-medium mt-0.5">
                                            {(() => {
                                                const start = new Date(`2000-01-01 ${appointment.appointment_time}`);
                                                const end = new Date(`2000-01-01 ${appointment.appointment_end_time}`);
                                                const diff = (end.getTime() - start.getTime()) / (1000 * 60);
                                                return `${diff} minutes`;
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notes Section (if available) */}
                        {appointment?.notes && (
                            <div className="mt-6 pt-4 border-t">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Notes</p>
                                        <p className="text-sm mt-1 text-muted-foreground">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Doctor Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">👨‍⚕️ Doctor Information</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                                <AvatarImage src={doctor?.avatar} />
                                <AvatarFallback>
                                    {doctor?.name?.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h3 className="font-semibold">{doctor?.name}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {doctor?.department}
                                </p>
                                <p className="text-sm">{doctor?.years_experience}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">👤 Contact Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {patient?.email}
                        </div>

                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {patient?.phone}
                        </div>

                        <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4 text-muted-foreground" />
                            Blood Group: {patient?.blood_group || "N/A"}
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Gender: {patient?.gender_formatted}
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <IndianRupee className="h-4 w-4" />
                            Payment Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm">

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Consultation Fee</span>
                            <span>{payment?.consultation_fee_formatted}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Admin Fee</span>
                            <span>{payment?.admin_fee_formatted}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>{payment?.discount_formatted}</span>
                        </div>

                        <Separator />

                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{payment?.total_formatted}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Payment Status</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                {payment?.status_label}
                            </Badge>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="uppercase">{payment?.payment_method}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}