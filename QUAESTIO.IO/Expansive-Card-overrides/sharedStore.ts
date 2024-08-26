// sharedStore.ts

import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

export type Variant = "close/mob" | "open/mob" | "open/dsk"
export type Breakpoint = "mobile" | "tablet" | "desktop"

export interface ItemState {
    mode: "span 1" | "span 2"
    variant: Variant
    hasBeenOpened: boolean
    backgroundColor: string
}

export interface StoreState {
    items: {
        [key: string]: ItemState
    }
    breakpoint: Breakpoint
    lastExpandedItem: string | null
    isAnyItemExpanded: boolean // Nuevo estado
    globalForceVisible: boolean
    expandedBackgroundColor: string
}

const TOP_OFFSET_VH = 8 // 8vh
const SCROLL_DELAY = 500 // 500ms delay

const vhToPx = (vh: number) => (window.innerHeight * vh) / 100

const initialState: StoreState = {
    items: {
        item1: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item2: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item3: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item4: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item5: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item6: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item7: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item8: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item9: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
        item10: {
            mode: "span 1",
            variant: "close/mob",
            hasBeenOpened: false,
            backgroundColor: "transparent",
        },
    },
    breakpoint: "mobile",
    lastExpandedItem: null,
    isAnyItemExpanded: false, // Inicializado como false
    globalForceVisible: false,
    expandedBackgroundColor: "rgba(240, 230, 255, 0.1)", // Add this line
}

export const useSharedStore = createStore<StoreState>(initialState)

export function expandItemAndCollapseOthers(
    store: StoreState,
    itemToExpand: string
): StoreState {
    const newState = { ...store }
    const newVariant: Variant =
        newState.breakpoint === "mobile" ? "open/mob" : "open/dsk"

    Object.keys(newState.items).forEach((key) => {
        if (key === itemToExpand) {
            newState.items[key] = {
                ...newState.items[key],
                mode:
                    newState.items[key].mode === "span 1" ? "span 2" : "span 1",
                variant:
                    newState.items[key].mode === "span 1"
                        ? newVariant
                        : "close/mob",
                hasBeenOpened: true,
                backgroundColor:
                    newState.items[key].mode === "span 1"
                        ? "transparent"
                        : store.expandedBackgroundColor,
            }
            newState.lastExpandedItem =
                newState.items[key].mode === "span 2" ? key : null
        } else {
            newState.items[key] = {
                ...newState.items[key],
                mode: "span 1",
                variant: "close/mob",
                backgroundColor: newState.items[key].hasBeenOpened
                    ? store.expandedBackgroundColor
                    : "transparent",
            }
        }
    })

    newState.isAnyItemExpanded = Object.values(newState.items).some(
        (item) => item.mode === "span 2"
    )

    return newState
}

export function markItemAsOpened(
    state: StoreState,
    itemKey: string
): StoreState {
    return {
        ...state,
        items: {
            ...state.items,
            [itemKey]: {
                ...state.items[itemKey],
                hasBeenOpened: true,
            },
        },
    }
}

export function updateBreakpoint(width: number): Breakpoint {
    if (width < 767) return "mobile"
    return "desktop" // Consideramos tanto tablet como desktop como "desktop"
}

export function toggleGlobalVisibility(state: StoreState): StoreState {
    return {
        ...state,
        globalForceVisible: !state.globalForceVisible,
    }
}

export function scrollToLastExpandedItem(lastExpandedItem: string | null) {
    if (lastExpandedItem) {
        setTimeout(() => {
            const element = document.getElementById(lastExpandedItem)
            if (element) {
                const y =
                    element.getBoundingClientRect().top +
                    window.pageYOffset -
                    vhToPx(TOP_OFFSET_VH)
                window.scrollTo({ top: y, behavior: "smooth" })
            }
        }, SCROLL_DELAY)
    }
}
