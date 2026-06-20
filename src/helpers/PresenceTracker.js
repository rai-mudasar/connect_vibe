'use client'

export function getPresenceStatus(lastSeen) {

    const diff = Date.now() - new Date(lastSeen);

    if (diff < 60000) {
        return "Online";
    } else {
        if (diff < (60000 * 60) - 1)
            return `${Math.floor(diff / 60000)} min ago`
        if (diff < (60000 * 60 * 24) - 1)
            return `${Math.floor(diff / (60000 * 60))} h ago`
        if (diff < (60000 * 60 * 24 * 30) - 1)
            return `${Math.floor(diff / (60000 * 60 * 24))} days ago`
        return `${Math.floor(diff / (60000 * 60 * 24 * 30))} months ago`
    }
}
