import { differenceInDays, format, formatDistanceToNow, isValid } from "date-fns";

export function getSmartDateTime(dateValue) {
    // 1. Safe check: Agar value empty ya missing hai
    if (!dateValue) return "Just now";

    const date = new Date(dateValue);

    // 2. Main Fix: Check agar date format parsing invalid hai (Invalid Date error handler)
    if (!isValid(date)) {
        return "Just now"; // Fallback text taaki app crash na ho
    }

    const now = new Date();
    const dayDiff = differenceInDays(now, date);

    // Today: "2 hours ago", "5 minutes ago"
    if (dayDiff === 0) {
        return formatDistanceToNow(date, { addSuffix: true });
    }

    // Yesterday: "Yesterday at 15:30"
    if (dayDiff === 1) {
        return `Yesterday at ${format(date, 'HH:mm')}`;
    }


    const finalDate = format(date, 'dd/MM/yyyy') + " at " + format(date, 'HH:mm');
    return finalDate;
}

export function getExactDateAndTime(dateValue) {
    if (!dateValue) return "Just now";

    const date = new Date(dateValue);
    if (!isValid(date)) {
        return "Just now";
    }

    const datePart = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });


    const now = new Date();
    const dayDiff = differenceInDays(now, date);

    // Today: "2 hours ago", "5 minutes ago"
    if (dayDiff === 0) {
        return formatDistanceToNow(date, { addSuffix: true });
    }

    // Yesterday: "Yesterday at 15:30"
    if (dayDiff === 1) {
        return `Yesterday at ${format(date, 'HH:mm')}`;
    }

    // Older dates: "22/06/2026 at 15:30"
    return `${datePart} at ${timePart}`;
}