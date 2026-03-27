"use client";

import { getDoctorSlots } from "@/api/resheodule";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/context/userContext";
import { useEffect, useState } from "react";

interface RescheduleAppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RescheduleAppointmentDialog({
    open,
    onOpenChange,
}: RescheduleAppointmentDialogProps) {
    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState<any[]>([]);

    const { user } = useAuth();

    // Fetch slots when dialog opens
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
            console.log("SLOTS API Response:", res);

            // Flatten slots & add day info
            const formattedSlots = res?.data?.flatMap((dayItem: any) =>
                dayItem.slots.map((slot: any) => {
                    const dateObj = new Date(slot.date);
                    const day = dateObj.getDate(); // day number
                    const day_name = slot.day_of_week
                        ? slot.day_of_week.charAt(0).toUpperCase() + slot.day_of_week.slice(1)
                        : "";

                    return {
                        ...slot,
                        day,
                        day_name,
                    };
                })
            );

            setSlots(formattedSlots || []);

            // Auto-select first available date
            if (formattedSlots.length > 0) {
                setSelectedDate(formattedSlots[0].date);
            }
        } catch (err) {
            console.log("Slot fetch error", err);
        }
    };

    const selectedSlotInfo = slots.find((s) => s.date === selectedDate);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Select Schedules</h2>
                    <span className="text-sm text-muted-foreground">
                        {selectedSlotInfo
                            ? `${selectedSlotInfo.day_name}, ${selectedSlotInfo.day} ${new Date(
                                selectedSlotInfo.date
                            ).toLocaleString("default", { month: "long" })} ${new Date(
                                selectedSlotInfo.date
                            ).getFullYear()}`
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
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center px-5 py-3 min-w-[60px] rounded-xl text-center transition ${selectedDate === date
                                        ? "bg-green-800 text-white"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <span className="text-lg font-semibold">{slotForDate?.day}</span>
                                <span className="text-xs">{slotForDate?.day_name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Time Slots Grid */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {slots
                        .filter((s) => s.date === selectedDate)
                        .map((slot) => (
                            <div
                                key={slot.id}
                                className="bg-gray-100 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-100 transition"
                            >
                                <p className="font-medium">
                                    {slot.start_time} - {slot.end_time}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {slot.consultation_type}
                                </p>
                            </div>
                        ))}
                </div>

                {/* Book Button */}
                <button className="w-full mt-6 bg-green-800 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
                    Book Appointment (₹{selectedSlotInfo?.consultation_fee || 1})
                </button>
            </DialogContent>
        </Dialog>
    );
}