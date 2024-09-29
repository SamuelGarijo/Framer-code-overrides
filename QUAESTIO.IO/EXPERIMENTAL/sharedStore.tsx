// sharedStore.ts
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"
import { ComponentType, useEffect, useRef } from "react"

const initialState = {
    variant: "start", // Example: "start", "closed", "open1", ...
    highlightedPoints: [],
    simpleGraphHeight: 0,
}

// Crear el store compartido
export const useSharedStore = createStore(initialState)

export default useSharedStore

export function CaptureGraphHeightOverride(Component) {
    return (props) => {
        const graphRef = useRef(null) // Referencia al div contenedor del gráfico
        const [, setStore] = useSharedStore() // Acceso al store compartido

        // Captura la altura del gráfico y actualiza el store
        useEffect(() => {
            if (graphRef.current) {
                const graphHeight = graphRef.current.offsetHeight
                setStore({ simpleGraphHeight: graphHeight }) // Actualiza el valor en el store
            }
        }, [])

        // Devuelve el componente con su ref
        return <Component {...props} ref={graphRef} />
    }
}

// Overrides para cambiar la variante
export function resetToStart(Component): ComponentType {
    return function (props) {
        const [_, setStore] = useSharedStore()

        const handleClick = () => {
            setStore({ variant: "start" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

// Overrides para cambiar la variante
export function openVariant1(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open1") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open1" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant2(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open2") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open2" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant3(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open3") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open3" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant4(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open4") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open4" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant5(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open5") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open5" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant6(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open6") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open6" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant7(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open7") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open7" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant8(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open8") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open8" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant9(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open9") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open9" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export function openVariant10(Component): ComponentType {
    return function (props) {
        const [store, setStore] = useSharedStore()

        const handleClick = (event) => {
            // Si ya está en "open1", no hacer nada
            if (store.variant === "open10") {
                event.preventDefault() // Previene cualquier comportamiento por defecto
                return
            }
            // Si no está en "selected" ni en "open1", cambia la variante del store a "open1"
            setStore({ variant: "open10" })
        }

        return <Component {...props} onClick={handleClick} />
    }
}
