import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, Phone, MapPin } from "lucide-react";

interface AppointmentCardProps {
    // Common props
    title: string;
    subtitle?: string;
    avatar: string;

    // Type-specific props
    type: "doctor" | "patient";

    // Doctor specific
    specialization?: string;
    timeSlot?: string;
    appointments?: number;
    available?: boolean;

    // Patient specific
    doctor?: string;
    time?: string;
    appointmentType?: "Video" | "Phone" | "In-Person";
    status?: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Scheduled";

    // Actions
    onClick?: () => void;
    className?: string;
}

const AppointmentCard = ({
    type,
    title,
    subtitle,
    avatar,
    specialization,
    timeSlot,
    appointments,
    available = true,
    doctor,
    time,
    appointmentType,
    status,
    onClick,
    className = ""
}: AppointmentCardProps) => {

    // Doctor card rendering
    if (type === "doctor") {
        const typeColors: Record<string, string> = {
            "Video": "bg-blue-50 text-blue-700 border-blue-200",
            "In-Person": "bg-purple-50 text-purple-700 border-purple-200"
        };

        return (
            <Card
                className={`border-border hover:shadow-md transition-all cursor-pointer ${className}`}
                onClick={onClick}
            >
                <CardContent className="p-3">
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8 border border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-sm">{title}</p>
                                    <p className="text-xs text-muted-foreground">{specialization}</p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`${typeColors[subtitle || "Video"]} text-[8px] px-1`}
                                >
                                    {subtitle}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] mt-1">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" /> {timeSlot}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-[8px] px-1.5 py-0.5">
                                    {appointments} appt{appointments !== 1 ? 's' : ''}
                                </Badge>
                                <Badge className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5">
                                    {available ? 'Available' : 'Busy'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Patient card rendering
    const typeIcons = {
        Video: <Video className="h-3 w-3" />,
        Phone: <Phone className="h-3 w-3" />,
        "In-Person": <MapPin className="h-3 w-3" />
    };

    const statusColors: Record<string, string> = {
        Confirmed: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Completed: "bg-blue-100 text-blue-800",
        Cancelled: "bg-red-100 text-red-800",
        Scheduled: "bg-indigo-100 text-indigo-800"
    };

    const typeColors = {
        Video: "border-blue-200",
        Phone: "border-gray-200",
        "In-Person": "border-purple-200"
    };

    return (
        <Card
            className={`border-border hover:shadow-md transition-all cursor-pointer ${className}`}
            onClick={onClick}
        >
            <CardContent className="p-3">
                <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {title?.split(' ').map((n: string) => n[0]).join('') || "PT"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-sm">{title}</p>
                                <p className="text-xs text-muted-foreground">{doctor}</p>
                            </div>
                            <Badge className={`${statusColors[status || "Confirmed"] || "bg-gray-100"} text-[8px] px-1.5 py-0.5`}>
                                {status}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] mt-1">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" /> {time}
                            </span>
                            <Badge
                                variant="outline"
                                className={`text-[8px] px-1 flex items-center gap-0.5 ${typeColors[appointmentType || "Video"] || "border-gray-200"}`}
                            >
                                {typeIcons[appointmentType || "Video"]}
                                {appointmentType}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AppointmentCard;