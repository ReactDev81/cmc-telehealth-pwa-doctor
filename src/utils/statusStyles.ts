// src/utils/statusStyles.ts

export const STATUS_STYLES = {
    appointment: {
        confirmed: "status-confirmed",
        failed: "status-failed",
        completed: "status-completed",
        rescheduled: "status-rescheduled",
        default: "status-default",
    },
    session: {
        ongoing: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        default: "bg-gray-100 text-gray-800",
    },
    report: {
        shared: "bg-blue-100 text-blue-700 border-blue-200",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
        approved: "bg-green-100 text-green-700 border-green-200",
        default: "bg-gray-100 text-gray-700 border-gray-200",
    },
    payment: {
        paid: "bg-green-100 text-green-700",
        success: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        failed: "bg-red-100 text-red-700",
        cancelled: "bg-gray-100 text-gray-700",
        refunded: "bg-purple-100 text-purple-700",
        default: "bg-gray-100 text-gray-700",
    },
};