
export interface ScheduleSlot {
    id: string | null;
    appointment_id: string;
    date: string;
    day_name: string;
    start_time: string;
    end_time: string;
    time_range: string;
    consultation_type: string;
    consultation_type_label: string;
    capacity: number;
    slot_capacity: number;
    booked_count: number;
    available_slots: number;
    is_recurring: boolean;
    doctor_room: string | null;
    is_available: boolean;
}

export interface ScheduleDay {
    date: string;
    day_name: string;
    day_short: string;
    slots: ScheduleSlot[];
}

export interface ScheduleData {
    start_date: string;
    end_date: string;
    days: ScheduleDay[];
}

export interface ScheduleResponse {
    success: boolean;
    message: string;
    filter: string;
    path: string;
    timestamp: string;
    data: ScheduleData;
}