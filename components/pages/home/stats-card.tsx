import { TrendingUp, Users } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: number | string;
    badgeText?: string;
    icon?: React.ReactNode;
}

export default function StatsCard({
    title,
    value,
    badgeText = "Patient base",
    icon,
}: StatsCardProps) {
    return (
        <Card key={title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon && <div className="h-4 w-4 text-[#0f5132]">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span>Updated from API</span>
                </p>
            </CardContent>
        </Card>
    );
}