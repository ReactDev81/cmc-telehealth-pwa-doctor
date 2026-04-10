"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Calendar, User, Clock, AlertCircle, Download, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePrescriptionByAppointmentId } from "@/queries/usePrescriptionByAppointmentId";
import { getStatusColor } from "@/src/utils/getStatusColor";
import AddPrescriptionDialog from "@/components/pages/appoitment/AddPrescriptionDialog";

// Accordion Item Component
function MedicineAccordionItem({ medicine, index }: { medicine: any; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const getMealLabel = (meal: string) => {
        switch (meal) {
            case "before_meal":
                return "Before Meal";
            case "after_meal":
                return "After Meal";
            case "with_meal":
                return "With Meal";
            default:
                return meal || "Not specified";
        }
    };

    return (
        <Card className="overflow-hidden">
            <div
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <CardHeader className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                                <span className="text-xs sm:text-sm font-semibold text-primary">#{index}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <h4 className="font-semibold text-sm sm:text-base truncate">{medicine.name}</h4>
                                    <Badge variant="outline" className="text-[9px] sm:text-xs px-1 sm:px-1.5">
                                        {medicine.type}
                                    </Badge>
                                    <Badge className={`${getStatusColor("session", medicine.status)} text-[9px] sm:text-xs px-1 sm:px-1.5`}>
                                        {medicine.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-[10px] sm:text-sm text-muted-foreground">
                                    <span>{medicine.dosage}</span>
                                    <span className="hidden xs:inline">•</span>
                                    <span>{medicine.frequencylabel}</span>
                                    <span className="hidden xs:inline">•</span>
                                    <span>{medicine.times}</span>
                                </div>
                            </div>
                        </div>
                        {isOpen ? (
                            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                        ) : (
                            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                        )}
                    </div>
                </CardHeader>
            </div>

            {isOpen && (
                <CardContent className="p-3 sm:p-4 pt-0 border-t">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">With Meal</p>
                            <p className="text-xs sm:text-sm font-medium">{getMealLabel(medicine.meal)}</p>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                            <p className="text-xs sm:text-sm font-medium">{medicine.date}</p>
                        </div>
                    </div>

                    {medicine.instructions && medicine.instructions.length > 0 && (
                        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
                            <p className="text-[10px] sm:text-xs text-blue-700 uppercase tracking-wide mb-1 sm:mb-2">Instructions</p>
                            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1">
                                {medicine.instructions.map((ins: string, i: number) => (
                                    <li key={i} className="text-[11px] sm:text-sm text-blue-800 break-words">{ins}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {medicine.notes && (
                        <div className="mt-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                            <p className="text-[10px] sm:text-xs text-yellow-700 uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-[11px] sm:text-sm text-yellow-800 break-words">{medicine.notes}</p>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export default function PrescriptionTab({ appointmentId }: { appointmentId: string }) {
    const { data, isLoading, error } = usePrescriptionByAppointmentId(appointmentId);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-red-500">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <p className="text-xs sm:text-sm">Error loading prescription</p>
                </div>
            </div>
        );
    }

    const medicines = data?.data?.medicines || [];
    const pdfUrl = data?.data?.pdf_url;
    const instructionsByDoctor = data?.data?.instructions_by_doctor;
    const nextVisitDate = data?.data?.next_visit_date;

    if (!medicines.length && !instructionsByDoctor && !nextVisitDate) {
        return (
            <>
                <div className="flex justify-end my-4">
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="h-8 sm:h-9 text-xs sm:text-sm"
                    >
                        Add Prescription
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6 sm:p-8 text-center">
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                            <p className="text-xs sm:text-sm text-muted-foreground">No prescription available</p>
                        </div>
                    </CardContent>
                </Card>
                <AddPrescriptionDialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                />
            </>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Medicines List - Accordion */}
            {medicines.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base md:text-lg">Prescribed Medicines</h3>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                                {medicines.length} Items
                            </Badge>
                        </div>

                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
                        >
                            Add Prescription
                        </Button>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        {medicines.map((medicine: any, index: number) => (
                            <MedicineAccordionItem
                                key={medicine.prescription_id}
                                medicine={medicine}
                                index={index + 1}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Doctor Instructions & Next Visit Card */}
            {(instructionsByDoctor || nextVisitDate) && (
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            Doctor's Advice
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                        {instructionsByDoctor && (
                            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-wide">Instructions by Doctor</p>
                                    <p className="text-[11px] sm:text-sm mt-1 leading-relaxed break-words">{instructionsByDoctor}</p>
                                </div>
                            </div>
                        )}

                        {nextVisitDate && (
                            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 shrink-0">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-wide">Next Visit Date</p>
                                    <p className="text-[11px] sm:text-sm font-medium mt-1 break-words">
                                        {new Date(nextVisitDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* PDF Download Button */}
                        {pdfUrl && (
                            <div className="pt-2">
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-[11px] sm:text-sm font-medium w-full sm:w-auto"
                                >
                                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Download Prescription (PDF)
                                    <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <AddPrescriptionDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            />
        </div>
    );
}