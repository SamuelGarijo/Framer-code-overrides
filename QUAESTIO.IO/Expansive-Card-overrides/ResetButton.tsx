// ResetButton.tsx

import type { ComponentType } from "react"
import { useSharedStore, scrollToLastExpandedItem } from "./sharedStore.ts"

export function withResetAllItems(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useSharedStore()

        const handleReset = () => {
            const lastExpandedItem = store.lastExpandedItem
            setStore((prevStore) => ({
                ...prevStore,
                items: Object.keys(prevStore.items).reduce(
                    (acc, key) => {
                        acc[key] = {
                            mode: "span 1",
                            variant: "close/mob",
                            hasBeenOpened: prevStore.items[key].hasBeenOpened,
                            backgroundColor: "transparent",
                        }
                        return acc
                    },
                    {} as typeof prevStore.items
                ),
                lastExpandedItem: null,
                isAnyItemExpanded: false,
            }))

            scrollToLastExpandedItem(lastExpandedItem)
        }

        return <Component {...props} onClick={handleReset} />
    }
}
