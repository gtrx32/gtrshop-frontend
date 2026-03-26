export default function formatStock(stock: number) {
    return stock > 0 ? `${stock} в наличии` : 'Нет в наличии'
}