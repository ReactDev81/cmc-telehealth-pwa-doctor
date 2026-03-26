"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import CustomTabs, { TabItem } from "@/components/pages/appoitment/CustomTabs";
import { useAppointmentById } from "@/queries/useAppointmentId";
import OverviewTab from "../detail-component/OverviewTab";
import ReportsTab from "../detail-component/ReportsTab";
import PreviousTab from "../detail-component/PreviousTab";
import PrescriptionTab from "../detail-component/PrescriptionTab";
import ReviewTab from "../detail-component/ReviewTab";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import AppointmentHeader from "../detail-component/AppointmentHeader";

export default function AppointmentDetail() {
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading, error } = useAppointmentById(id);

    // ✅ ADD THIS
    const [activeTab, setActiveTab] = useState("overview");

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading appointment</div>;

    const appointment = data?.data;

    const tabs: TabItem[] = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab appointment={appointment} />,
        },
        {
            key: "reports",
            label: "Medical Reports",
            content: <ReportsTab appointment={appointment} />,
        },
        {
            key: "previous",
            label: "Previous Appointments",
            content: <PreviousTab appointment={appointment} />,
        },
        {
            key: "prescription",
            label: "Prescription",
            content: <PrescriptionTab appointment={appointment} />,
        },
        {
            key: "review",
            label: "Review",
            content: <ReviewTab appointment={appointment} />,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="heading-lg">Appointment Detail</h1>

            <AppointmentHeader appointment={appointment} />
            
            <CustomTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}   // ✅ IMPORTANT
                tabsListClassName="w-full mb-5"
            />
        </div>
    );
}