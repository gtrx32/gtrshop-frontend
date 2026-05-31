export const orderStatusTitles: Record<string, string> = {
    pending: 'Ожидание',
    paid: 'Оплачено',
    processing: 'Обработка',
    shipped: 'Отправлено',
    completed: 'Завершено',
    cancelled: 'Отменено',
}

export const orderStatusClasses: Record<string, string> = {
    pending: 'border-gtr-warning/50 text-gtr-warning',
    paid: 'border-gtr-highlight/50 text-gtr-highlight',
    processing: 'border-gtr-accent/50 text-gtr-accent',
    shipped: 'border-gtr-highlight/50 text-gtr-highlight',
    completed: 'border-gtr-highlight/50 text-gtr-highlight',
    cancelled: 'border-gtr-error/50 text-gtr-error',
}

export const getOrderStatusTitle = (status: string) => {
    return orderStatusTitles[status] ?? status
}

export const getOrderStatusClass = (status: string) => {
    return orderStatusClasses[status] ?? 'border-gtr-soft text-gtr-toned'
}