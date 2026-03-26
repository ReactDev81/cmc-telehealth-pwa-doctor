"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports({ appointment }: { appointment: any }) {
    const reports = appointment?.medical_reports || [];

    const getReportStatusColor = (status: string) => {
        switch (status) {
            case "shared":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            case "approved":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // ✅ EMPTY STATE
    if (!reports.length) {
        return (
            <Card className="rounded-2xl border shadow-sm">
                <CardContent className="py-12 text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />

                    <h3 className="text-lg font-semibold">
                        No medical reports available
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        Reports will appear here when uploaded
                    </p>
                </CardContent>
            </Card>
        );
    }

    // ✅ DATA AVAILABLE
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reports.map((report: any) => (
                <Card
                    key={report.id}
                
                >
                    <CardHeader className=" flex justify-between items-center">
                        <CardTitle className="text-base flex items-center gap-2">
                            <span className="truncate">{report.title}</span>

                            <Badge variant="outline">{report.type_label}</Badge>
                            <Badge
                                variant="outline"
                                className={`${getReportStatusColor(report.status)} text-xs font-medium px-2 py-0.5`}
                            >
                                {report.status}
                            </Badge>
                        </CardTitle>

                        <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(report.file_url, "_blank")}
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            View Report
                        </Button>

                    </CardHeader>

                    <CardContent className="space-y-1 text-sm">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{report.report_date_formatted}</span>
                        </div>

                        {/* Doctor */}
                        <p className="text-muted-foreground">
                            Doctor:{" "}
                            <span className="font-medium text-foreground">
                                {report.doctor_name}
                            </span>
                        </p>

                        {/* Action */}

                    </CardContent>
                </Card>
            ))}
        </div>
    );
}