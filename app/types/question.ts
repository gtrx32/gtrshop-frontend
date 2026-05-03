export interface Question {
    id: number
    name: string
    email: string
    phone: string
    message: string
    created_at: string
    updated_at: string
}

export type StoreQuestionPayload = Omit<Question, 'id' | 'created_at' | 'updated_at'>