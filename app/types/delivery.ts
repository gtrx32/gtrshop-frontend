export type Delivery = {
    id: number
    recipient_name: string | null
    phone: string | null
    email: string | null
    address: string | null
    status: string
    tracking_code: string | null
    shipped_at: string | null
    delivered_at: string | null
    created_at: string
    updated_at: string
}

export type OrderDeliveryPayload = {
    recipient_name: string
    phone: string
    email: string
    address: string
}