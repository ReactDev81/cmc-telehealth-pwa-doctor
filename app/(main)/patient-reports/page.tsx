"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Download,
    ArrowLeft,
    Calendar,
    FileText,
    FileCheck,
    Eye,
    Activity,
    Heart,
    X,
    Droplet,
    User,
} from "lucide-react";

import { usePatientReports } from "@/queries/usePatientReports";
import type {
    PatientReportItem,
    PatientReportPatient,
} from "@/types/patient-reports";

export default function PatientReportsPage() {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] =
        useState<PatientReportPatient | null>(null);
    const [page, setPage] = useState(1);

    // Main list query — no filter
    const { data, isLoading, isError, error } = usePatientReports({
        page,
        per_page: 10,
    });

    // Modal query — fires with filter=all only when a patient is selected
    const { data: modalData, isLoading: modalLoading } = usePatientReports({
        page: 1,
        per_page: 100,
        filter: "all",
    });

    const patients: PatientReportPatient[] = (data?.data ?? []).map((patient) => ({
        ...patient,
        reports: Array.isArray(patient.reports) ? patient.reports : [],
    }));

    const pagination = data?.pagination;

    const filteredPatients = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        if (!q) return patients;

        return patients.filter((patient) => {
            const reports = Array.isArray(patient.reports) ? patient.reports : [];

            return (
                patient.name?.toLowerCase().includes(q) ||
                patient.id?.toLowerCase().includes(q) ||
                reports.some(
                    (report) =>
                        report.report_name?.toLowerCase().includes(q) ||
                        report.report_type?.toLowerCase().includes(q) ||
                        report.type_label?.toLowerCase().includes(q)
                )
            );
        });
    }, [patients, searchQuery]);

    // Reports shown in the modal: from the filter=all response, filtered by selected patient id
    const selectedPatientReports = useMemo(() => {
        if (!selectedPatient) return [];
        const allPatients: PatientReportPatient[] = modalData?.data ?? [];
        const match = allPatients.find((p) => p.id === selectedPatient.id);
        return Array.isArray(match?.reports) ? match.reports : [];
    }, [modalData, selectedPatient]);

    const getInitials = (name?: string | null) => {
        if (!name) return "NA";
        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getReportTypeIcon = (type?: string | null) => {
        const normalized = (type || "").toLowerCase();

        if (
            normalized.includes("lab") ||
            normalized.includes("blood") ||
            normalized.includes("test")
        ) {
            return <Droplet className="h-4 w-4 text-red-500" />;
        }

        if (
            normalized.includes("radiology") ||
            normalized.includes("x-ray") ||
            normalized.includes("scan") ||
            normalized.includes("mri")
        ) {
            return <Activity className="h-4 w-4 text-blue-500" />;
        }

        if (normalized.includes("card") || normalized.includes("heart")) {
            return <Heart className="h-4 w-4 text-pink-500" />;
        }

        return <FileText className="h-4 w-4 text-primary" />;
    };

    const openReportFile = (report: PatientReportItem) => {
        const fileUrl = report.files?.url;
        if (fileUrl) {
            window.open(fileUrl, "_blank", "noopener,noreferrer");
        }
    };

    const downloadAllReports = (patient: PatientReportPatient) => {
        const reports = Array.isArray(patient.reports) ? patient.reports : [];

        reports.forEach((report) => {
            if (report.files?.url) {
                window.open(report.files.url, "_blank", "noopener,noreferrer");
            }
        });
    };

    return (
        <div className="space-y-6">
            <Button onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">
                        Patient Reports
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        View and manage patient medical reports
                    </p>
                </div>

                <Button variant="outline" className="gap-2" disabled>
                    <Download className="h-4 w-4" />
                    Export All
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient name, report name, or report type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {isLoading && (
                <Card className="border-border">
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Loading patient reports...
                    </CardContent>
                </Card>
            )}

            {isError && (
                <Card className="border-border">
                    <CardContent className="py-12 text-center text-red-500">
                        Failed to load patient reports.
                        <div className="mt-2 text-sm">
                            {(error as Error)?.message || "Something went wrong"}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.map((patient) => {
                            const reports = Array.isArray(patient.reports)
                                ? patient.reports
                                : [];

                            return (
                                <Card
                                    key={patient.id}
                                    className="border-border hover:shadow-lg transition-all flex flex-col h-full"
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar className="h-12 w-12 border-2 border-primary/20">
                                                    <AvatarImage
                                                        src={patient.avatar || ""}
                                                        alt={patient.name || ""}
                                                    />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {getInitials(patient.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="min-w-0">
                                                    <CardTitle className="text-lg truncate">
                                                        {patient.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm truncate">
                                                        {patient.patient_id}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            {/* <Badge variant="outline">
                                                {patient.blood_group || "N/A"}
                                            </Badge> */}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>Patient Reports Summary</span>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Recent Reports
                                                </p>
                                                <Badge variant="outline">
                                                    {patient.total_reports_count} Total
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                {reports.slice(0, 2).map((report) => (
                                                    <div
                                                        key={report.id}
                                                        className="flex items-center gap-2 text-xs bg-accent/30 p-2 rounded"
                                                    >
                                                        {getReportTypeIcon(report.report_type)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">
                                                                {report.report_name}
                                                            </p>
                                                            <p className="text-muted-foreground truncate">
                                                                {report.report_date_formatted ||
                                                                    report.uploaded_at}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                                {reports.length > 2 && (
                                                    <p className="text-xs text-muted-foreground text-center">
                                                        +{reports.length - 2} more reports
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>

                                    <div className="mt-auto px-5 pb-5">
                                        <Button
                                            className="w-full gap-2"
                                            onClick={() => setSelectedPatient(patient)}
                                        >
                                            <FileCheck className="h-4 w-4" />
                                            Click to view reports
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredPatients.length === 0 && (
                        <Card className="border-border">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
                                <p className="font-medium mb-1">No patients found</p>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {pagination && searchQuery.trim() === "" && (
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-muted-foreground">
                                Page {pagination.current_page} of {pagination.last_page} • Total{" "}
                                {pagination.total} patients
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={pagination.current_page <= 1}
                                    onClick={() => setPage(1)}
                                >
                                    First
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={pagination.current_page <= 1}
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                >
                                    Prev
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={pagination.current_page >= pagination.last_page}
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.min(prev + 1, pagination.last_page)
                                        )
                                    }
                                >
                                    Next
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={pagination.current_page >= pagination.last_page}
                                    onClick={() => setPage(pagination.last_page)}
                                >
                                    Last
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {selectedPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {selectedPatient.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedPatient.patient_id}
                                    </CardDescription>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedPatient(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <h3 className="font-semibold mb-4">Medical Reports</h3>

                            <div className="space-y-3">
                                {modalLoading ? (
                                    <div className="text-center text-muted-foreground py-8">Loading reports...</div>
                                ) : selectedPatientReports.length > 0 ? (
                                    selectedPatientReports.map((report) => (
                                        <Card key={report.id} className="border-border">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex gap-3 min-w-0">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                            {getReportTypeIcon(report.report_type)}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-medium truncate">
                                                                {report.report_name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {report.type_label}
                                                            </p>

                                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>
                                                                    Uploaded{" "}
                                                                    {report.uploaded_at ||
                                                                        report.report_date_formatted}
                                                                </span>
                                                                <span>•</span>
                                                                <span className="capitalize">
                                                                    {report.status}
                                                                </span>
                                                            </div>

                                                            {report.files?.name && (
                                                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                                                    File: {report.files.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => openReportFile(report)}
                                                        disabled={!report.files?.url}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        No reports available
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                                Close
                            </Button>

                            <Button
                                className="gap-2"
                                onClick={() => downloadAllReports(selectedPatient)}
                                disabled={!selectedPatientReports.length}
                            >
                                <Download className="h-4 w-4" />
                                Download All
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}