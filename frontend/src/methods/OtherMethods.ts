export const getVideoFormat = (videoUrl: string) => {
    return ( "video/" + videoUrl.split(".").at(-1))
}

export function leadUserToProfilePage(navigate:(username: string)=>void, username: string){
    navigate(`/${username}`);
}   

export function parseDate(dateISO: string): string {
    const date = new Date(dateISO);
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };
    const timeStr = date.toLocaleTimeString('en-US', timeOptions); // e.g., "3:09 PM"
    const dateStr = date.toLocaleDateString('en-US', dateOptions); // e.g., "Aug 2, 2025"
    return `${timeStr} · ${dateStr}`;
}

export function parseJoinedDate(dateIso: string): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const parts = formatter.formatToParts(new Date(dateIso));
    const formatted = `${parts[0].value} ${parts[2].value} ${parts[4].value}`;
    return formatted;
}