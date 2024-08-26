import type { ComponentType } from "react"

// Define el número de líneas después de las cuales se truncará el texto
const LINES = 6 // Puedes ajustar este número según tus necesidades

export default function withLineTruncate(Component): ComponentType {
    return (props) => {
        const styles = {
            ...props?.style,
            WebkitLineClamp: `${LINES}`,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            overflow: "hidden",
        }
        return <Component {...props} style={styles} />
    }
}
