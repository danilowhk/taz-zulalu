/* eslint-disable import/prefer-default-export */
export const displayDateWithoutTimezone = (dateString: Date | string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    })
}
