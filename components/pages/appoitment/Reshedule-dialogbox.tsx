"use client";

import { getDoctorSlots } from "@/api/resheodule";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/context/userContext";
import { rescheduleAppointment } from "@/mutations/reschedule";
import { useEffect, useState } from "react";

interface RescheduleAppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointmentId: string;
}

export function RescheduleAppointmentDialog({
    open,
    onOpenChange,
    appointmentId,
}: RescheduleAppointmentDialogProps) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState<any>(null); // ✅ selected time slot
    const [slots, setSlots] = useState<any[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        if (open && user?.doctor_id) {
            fetchSlots();
        }
    }, [open, user]);

    const fetchSlots = async () => {
        try {
            const doctorId = user?.doctor_id;
            if (!doctorId) return;

            const res = await getDoctorSlots(doctorId);

            const formattedSlots = res?.data?.flatMap((dayItem: any) =>
                dayItem.slots.map((slot: any) => {
                    const dateObj = new Date(slot.date);
                    const day = dateObj.getDate();
                    const day_name = slot.day_of_week
                        ? slot.day_of_week.charAt(0).toUpperCase() + slot.day_of_week.slice(1)
                        : "";

                    return { ...slot, day, day_name };
                })
            );

            setSlots(formattedSlots || []);

            console.log("Selected Slot:", selectedSlot);
         

            // Auto-select first available date
            if (formattedSlots.length > 0) {
                setSelectedDate(formattedSlots[0].date);
            }

            setSelectedSlot(null); // reset time selection on fetch
        } catch (err) {
            console.log("Slot fetch error", err);
        }
    };

    const selectedSlotInfo = selectedSlot; // for button display

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl! rounded-2xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Select Schedules</h2>
                    <span className="text-sm text-muted-foreground">
                        {selectedDate
                            ? (() => {
                                const slotForDate = slots.find((s) => s.date === selectedDate);
                                if (!slotForDate) return "Select a date";
                                return `${slotForDate.day_name}, ${slotForDate.day} ${new Date(
                                    slotForDate.date
                                ).toLocaleString("default", { month: "long" })} ${new Date(
                                    slotForDate.date
                                ).getFullYear()}`;
                            })()
                            : "Select a date"}
                    </span>
                </div>

                {/* Dates Horizontal Scroll */}
                <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
                    {Array.from(new Set(slots.map((slot) => slot.date))).map((date) => {
                        const slotForDate = slots.find((s) => s.date === date);
                        return (
                            <button
                                key={date}
                                onClick={() => {
                                    setSelectedDate(date);
                                    setSelectedSlot(null); // reset slot when date changes
                                }}
                                className={`flex flex-col items-center p-3  rounded-xl text-center transition ${selectedDate === date
                                    ? "bg-green-800 text-white"
                                    : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <span className="text-base font-semibold">{slotForDate?.day}</span>
                                <span className="text-xs">{slotForDate?.day_name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Time Slots Grid */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slots
                        .filter((s) => s.date === selectedDate)
                        .map((slot) => (
                            <div
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-3 px-2 flex flex-col items-center justify-center text-center cursor-pointer rounded-xl transition
                                ${selectedSlot?.id === slot.id ? "bg-green-800 text-white" : "bg-gray-100 hover:bg-green-100"}
                                `}
                            >
                                <p className="font-medium text-xs">
                                    {slot.start_time} - {slot.end_time}
                                </p>
                                <p className="text-xs">
                                    {slot.consultation_type_label}
                                    {slot.consultation_type === "in-person" && slot.opd_type
                                        ? ` (${slot.opd_type})` 
                                        : ""}
                                </p>
                            </div>
                        ))}
                </div>

                {/* Book Button */}
                <button
                    disabled={!selectedSlot}
                    onClick={async () => {
                        if (!selectedSlot) return;

                        // Prepare payload
                        const payload = {
                            appointment_id: appointmentId,// make sure slot has this
                            availability_id: selectedSlot.id, // slot id
                            appointment_date: selectedSlot.date,
                            appointment_time: selectedSlot.start_time,
                        };

                
                        console.log("Reschedule payload:", payload); // ✅ check in console

                        try {
                            const res = await rescheduleAppointment(payload);
                            console.log("Reschedule response:", res);
                            // Optionally close dialog or show toast here
                        } catch (err) {
                            console.error("Error rescheduling:", err);
                        }
                    }}
                    className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${selectedSlot
                            ? "bg-green-800 hover:bg-green-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Reschedule
                </button>
            </DialogContent>
        </Dialog>
    );
}