import type { ComponentType } from "react"
import { useEffect, useRef, useCallback, useState } from "react"
import {
    useSharedStore,
    expandItemAndCollapseOthers,
    updateBreakpoint,
} from "./sharedStore.ts"

const ITEM_NUMBER = 1
const TOP_OFFSET_VH = 8 // 8vh
const SCROLL_DELAY = 500 // 500ms delay

const vhToPx = (vh: number) => (window.innerHeight * vh) / 100

const useItemState = (itemNumber: number) => {
    const [store, setStore] = useSharedStore()
    const itemState = store.items[`item${itemNumber}`]
    const [topOffset, setTopOffset] = useState(0)

    useEffect(() => {
        const updateOffset = () => {
            setTopOffset(vhToPx(TOP_OFFSET_VH))
            setStore((prevStore) => ({
                ...prevStore,
                breakpoint: updateBreakpoint(window.innerWidth),
            }))
        }
        updateOffset()
        window.addEventListener("resize", updateOffset)
        return () => window.removeEventListener("resize", updateOffset)
    }, [setStore])

    const toggleExpand = useCallback(() => {
        setStore((prevStore) =>
            expandItemAndCollapseOthers(prevStore, `item${itemNumber}`)
        )
    }, [setStore, itemNumber])

    return { itemState, toggleExpand, topOffset, breakpoint: store.breakpoint }
}

const getExpandedStyles = (isExpanded: boolean, topOffset: number) => ({
    width: isExpanded ? "100%" : undefined,
    flexBasis: isExpanded ? "100%" : undefined,
    maxWidth: isExpanded ? "100%" : undefined,
    position: isExpanded ? "sticky" : "relative",
    top: isExpanded ? `${topOffset}px` : undefined,
    zIndex: isExpanded ? 1 : undefined,
})

export function withExpandableItem(Component): ComponentType {
    return (props) => {
        const { itemState, topOffset } = useItemState(ITEM_NUMBER)
        const ref = useRef<HTMLDivElement>(null)

        const style = {
            ...props.style,
            ...getExpandedStyles(itemState.mode === "span 2", topOffset),
            width: itemState.mode === "span 2" ? "100%" : undefined,
            flexBasis: itemState.mode === "span 2" ? "100%" : undefined,
            maxWidth: itemState.mode === "span 2" ? "100%" : undefined,
            height: itemState.mode === "span 2" ? "auto" : "fit-content",
            minHeight: itemState.mode === "span 2" ? "90vh" : undefined,
            transition: "all 0.3s ease-in-out",
            position: "relative",
            top: "auto",
            zIndex: "auto",
        }

        return (
            <Component
                {...props}
                style={style}
                ref={ref}
                id={`item${ITEM_NUMBER}`}
            />
        )
    }
}

const scrollToElement = (elementId: string) => {
    setTimeout(() => {
        const element = document.getElementById(elementId)
        if (element) {
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset -
                vhToPx(TOP_OFFSET_VH)
            window.scrollTo({ top: y, behavior: "smooth" })
        }
    }, SCROLL_DELAY)
}

export function withToggleExpandButton(Component): ComponentType {
    return (props) => {
        const { itemState, toggleExpand } = useItemState(ITEM_NUMBER)

        const handleClick = () => {
            toggleExpand()
            if (itemState.mode !== "span 2") {
                scrollToElement(`item${ITEM_NUMBER}`)
            }
        }

        return (
            <Component
                {...props}
                onClick={handleClick}
                variant={itemState.mode === "span 2" ? "Expanded" : "Default"}
            />
        )
    }
}

export function withVariantChange(Component): ComponentType {
    return (props) => {
        const { itemState, breakpoint } = useItemState(ITEM_NUMBER)

        const style = {
            ...props.style,
            height: itemState.variant.startsWith("open")
                ? "90vh"
                : "fit-content",
        }

        let variant = itemState.variant
        if (breakpoint === "mobile") {
            variant = itemState.mode === "span 2" ? "open/mob" : "close/mob"
        } else {
            variant = itemState.mode === "span 2" ? "open/dsk" : "close/dsk"
        }

        return <Component {...props} style={style} variant={variant} />
    }
}

export function withScrollToElement(Component): ComponentType {
    return (props) => {
        const handleClick = () => {
            if (props.targetElementId) {
                scrollToElement(props.targetElementId)
            }
        }

        return <Component {...props} onClick={handleClick} />
    }
}
