import { differenceInDays, format, formatDistanceToNow } from "date-fns";

export default function getSmartDateTime(dateValue) {
    const date = new Date(dateValue);
    const now = new Date();

    const dayDiff = differenceInDays(now, date);

    if(dayDiff === 0) {
        return formatDistanceToNow(date, {addSuffix: true});
    } else if(dayDiff === 1) {
        const finalDate = formatDistanceToNow(date) + " at " + format(date, 'HH-mm')
        return finalDate
    }
    const finalDate = format(date, 'dd/MM/yyyy') + " at " + format(date, 'HH:mm')
    return finalDate
}