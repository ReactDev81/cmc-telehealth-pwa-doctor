"use client"

import { useMyAppointments } from "@/querys/useAppointments";
import { useMySchedules } from "@/queries/getMySchedules";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types/appointment";
import { ScheduleDay } from "@/types/schedule";

const MySchedulesPage = () => {

    const { data, isLoading, error } = useMyAppointments("all");
    const { data: scheduleData, isLoading: scheduleLoading, error: scheduleError } = useMySchedules();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const onDateClick = (date: Date | undefined) => {
        setSelectedDate(date);
    };

    const onMonthChange = (month: Date) => {
        setCurrentDate(month);
    };

    const getOPDCount = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return scheduleData?.data?.days?.filter((s: ScheduleDay) => {
            const sDate = new Date(s.date);
            return sDate.getDate() === day && sDate.getMonth() === month && sDate.getFullYear() === year;
        }).length || 0;
    };

    const hasAppointments = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return data?.data?.some((appt: Appointment) => {
            const apptDate = new Date(appt.appointment_date);
            return apptDate.getDate() === day && apptDate.getMonth() === month && apptDate.getFullYear() === year;
        }) || false;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const bookedDates = Array.from(
        { length: 15 },
        (_, i) => new Date(new Date().getFullYear(), 1, 12 + i)
    )

    // console.log('data', data);
    // console.log('scheduleData', scheduleData);

    return (
        <div>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Doctor's Schedule</h1>
                <p className="text-muted-foreground">Manage your OPD appointments and availability</p>
            </div>

            <Card className="border-border">

                <CardHeader>
                    <CardTitle>
                        March 2026
                    </CardTitle>
                    <CardDescription>
                        <span className="font-semibold text-primary">OPD sessions</span> this month
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                        {/* Left Column - Calendar */}
                        <div className="lg:col-span-1">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={onDateClick}
                                month={currentDate}
                                onMonthChange={onMonthChange}
                                className="rounded-lg border gap-1 w-full"
                                components={{
                                    DayButton: ({ day, ...props }) => {
                                        const date = day.date;
                                        const count = getOPDCount(date);
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                                        const isTodayDate = isToday(date);
                                        const hasAppt = hasAppointments(date);
                                        return (
                                            <button
                                                {...props}
                                                className={`
                                                    relative flex items-center justify-center
                                                    aspect-square w-full
                                                    text-sm font-normal rounded-md transition-all duration-200
                                                    h-auto mx-auto z-10
                                                    ${isSelected
                                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                                        : ''
                                                    }
                                                    ${isTodayDate && !isSelected
                                                        ? 'bg-primary/5 text-primary hover:bg-primary/10 font-bold border border-primary'
                                                        : ''
                                                    }
                                                    ${hasAppt && !isSelected && !isTodayDate
                                                        ? 'bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer'
                                                        : ''
                                                    }
                                                    ${!hasAppt && !isTodayDate && !isSelected
                                                        ? 'text-muted-foreground'
                                                        : ''
                                                    }
                                                `}
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <span>{date.getDate()}</span>
                                                    {count > 0 && (
                                                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                            <Badge variant="outline" className="h-4 px-1 text-[8px] bg-primary/10">
                                                                {count} {count === 1 ? 'OPD' : "OPD's"}
                                                            </Badge>
                                                        </span>
                                                    )}
                                                    {isTodayDate && !isSelected && (
                                                        <span className="absolute top-0 right-0 h-3 w-3 bg-primary rounded-full" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    }
                                }}
                            />
                        </div>

                        {/* Middle Column - Doctor OPD Schedule */}
                        <div className="lg:col-span-1">

                        </div>


                        {/* Right Column - Booked Appointments */}
                        <div className="lg:col-span-1">

                        </div>

                    </div>

                </CardContent>

            </Card>
        </div>
    );
};

export default MySchedulesPage;