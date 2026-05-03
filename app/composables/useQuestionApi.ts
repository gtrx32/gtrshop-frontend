import type { StoreQuestionPayload, Question } from '~/types/question'

export const useQuestionApi = () => {
    const api = useApi()

    const storeQuestion = async (payload: StoreQuestionPayload) => {
        return await api<Question>('/api/questions', {
            method: 'POST',
            body: payload,
            credentials: 'include'
        })
    }

    return { storeQuestion }
}