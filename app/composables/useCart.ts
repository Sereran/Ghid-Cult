export interface CartItem {
    tourId: string
    persons: number
}

export const useCart = () => {
    const items = useState<CartItem[]>('cart_items', () => [])
    const isOpen = useState<boolean>('cart_drawer_open', () => false)

    const openCart = () => { isOpen.value = true }
    const closeCart = () => { isOpen.value = false }
    const toggleCart = () => { isOpen.value = !isOpen.value }

    const addToCart = (tourId: string, persons: number) => {
        const existing = items.value.find((i) => i.tourId === tourId)
        if (existing) {
            existing.persons = persons
        } else {
            items.value.push({ tourId, persons })
        }
        openCart()
    }

    const removeFromCart = (tourId: string) => {
        items.value = items.value.filter((i) => i.tourId !== tourId)
    }

    const updatePersons = (tourId: string, persons: number) => {
        if (persons < 1) return
        const existing = items.value.find((i) => i.tourId === tourId)
        if (existing) {
            existing.persons = persons
        }
    }

    const totalItems = computed(() => {
        return items.value.reduce((sum, item) => sum + item.persons, 0)
    })

    return {
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updatePersons,
        totalItems
    }
}