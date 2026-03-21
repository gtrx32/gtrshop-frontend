export default function (
    value: string | Date | null,
    options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    },
    locale = 'ru-RU'
): string {
    if (value === null) return '';

    const date = typeof value === 'string' ? new Date(value) : value

    if (Number.isNaN(date.getTime())) return ''

    return new Intl.DateTimeFormat(locale, options).format(date)
}