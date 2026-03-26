"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrescriptionTab({ appointment }: { appointment: any }) {
    const prescriptions = appointment?.prescriptions;

    // ✅ FIX: ensure array
    const list = Array.isArray(prescriptions) ? prescriptions : [];

    // ✅ EMPTY STATE
    if (list.length === 0) {
        return (
            <Card className="rounded-2xl border shadow-sm">
                <CardContent className="py-12 text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />

                    <h3 className="text-lg font-semibold">
                        No prescriptions available
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                        Prescriptions will appear here after consultation
                    </p>
                </CardContent>
            </Card>
        );
    }

    // ✅ DATA UI
    return (
        <div className="space-y-4">
            {list.map((item: any) => (
                <Card key={item.id} className="rounded-2xl border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex justify-between">
                            <span>{item.title || "Prescription"}</span>
                            {item.status && <Badge>{item.status}</Badge>}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm">
                        {item.date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{item.date}</span>
                            </div>
                        )}

                        {item.notes && (
                            <div>
                                <p className="text-xs text-muted-foreground">Notes</p>
                                <p>{item.notes}</p>
                            </div>
                        )}

                        {item.file_url && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(item.file_url, "_blank")}
                            >
                                View Prescription
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}