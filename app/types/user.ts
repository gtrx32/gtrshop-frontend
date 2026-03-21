import type { Review } from './review'
import type { Cart } from './cart'
import type { Order } from './order'

export type User = {
    id: number
    name: string
    email: string
    avatar: string | null

    reviews?: Review[]
    cart?: Cart
    orders?: Order[]
}

export type LoginPayload = {
    email: string
    password: string
    remember?: boolean
}

export type RegisterPayload = {
    name: string
    email: string
    password: string
    password_confirmation: string
}