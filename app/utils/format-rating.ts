export default function formatRating(rating?: number) {
    return rating ? rating.toFixed(1) : null
}