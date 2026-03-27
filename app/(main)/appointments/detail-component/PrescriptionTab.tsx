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
    console.log("medicine : ", medicine);
    const [isOpen, setIsOpen] = useState(false);

    // const getStatusColor = (status: string) => {
    //     switch (status?.toLowerCase()) {
    //         case "ongoing":
    //             return "bg-green-100 text-green-800";
    //         case "completed":
    //             return "bg-blue-100 text-blue-800";
    //         case "cancelled":
    //             return "bg-red-100 text-red-800";
    //         default:
    //             return "bg-gray-100 text-gray-800";
    //     }
    // };

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
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <span className="text-sm font-semibold text-primary">#{index}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-base">{medicine.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                        {medicine.type}
                                    </Badge>
                                    <Badge className={getStatusColor("session", medicine.status)}>
                                        {medicine.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span>{medicine.dosage}</span>
                                    <span>•</span>
                                    <span>{medicine.frequencylabel}</span>
                                    <span>•</span>
                                    <span>{medicine.times}</span>
                                </div>
                            </div>
                        </div>
                        {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </CardHeader>
            </div>

            {isOpen && (
                <CardContent className="p-4 pt-0 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Dosage & Frequency */}
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">With Meal</p>
                            <p className="text-sm font-medium">{getMealLabel(medicine.meal)}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                            <p className="text-sm font-medium">{medicine.date}</p>
                        </div>

                    </div>

                    {/* Instructions */}
                    {medicine.instructions && medicine.instructions.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700 uppercase tracking-wide mb-2">Instructions</p>
                            <ul className="list-disc list-inside space-y-1">
                                {medicine.instructions.map((ins: string, i: number) => (
                                    <li key={i} className="text-sm text-blue-800">{ins}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Notes */}
                    {medicine.notes && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-xs text-yellow-700 uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-sm text-yellow-800">{medicine.notes}</p>
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
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    <p>Error loading prescription</p>
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
            <Card>
                <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No prescription available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">

            {/* Medicines List - Accordion */}
            {medicines.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg">Prescribed Medicines</h3>
                            <Badge variant="secondary">{medicines.length} Items</Badge>
                        </div>

                        <Button onClick={() => setIsAddDialogOpen(true)}>Add Prescription</Button>
                    </div>

                    <div className="space-y-3">
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
                <Card >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <User className="h-5 w-5 text-primary" />
                            Doctor's Advice
                        </CardTitle>
                    </CardHeader>


                    <CardContent className="space-y-4">
                        {instructionsByDoctor && (
                            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Instructions by Doctor</p>
                                    <p className="text-sm mt-1 leading-relaxed">{instructionsByDoctor}</p>
                                </div>
                            </div>
                        )}

                        {nextVisitDate && (
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Visit Date</p>
                                    <p className="text-sm font-medium mt-1">
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
                    </CardContent>

                    {/* PDF Download Button */}
                    {pdfUrl && (
                        <div className="ml-5">
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                                <Download className="h-4 w-4" />
                                Download Prescription (PDF)
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    )}
                </Card>
            )}
            
            <AddPrescriptionDialog 
                open={isAddDialogOpen} 
                onOpenChange={setIsAddDialogOpen} 
            />
        </div>
    );
}