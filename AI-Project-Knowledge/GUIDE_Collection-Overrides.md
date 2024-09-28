<tags>collections, overrides, framer, dynamic-content</tags>

# Working with Collections in Framer Overrides

This section focuses on how to apply overrides to individual elements within a collection in Framer.

## Handling Overrides for Collection Elements

When working with collections, each element needs its own unique state and behavior. This requires a special approach to structuring our overrides.

1. **Using Unique Identifiers**: Each element in the collection must have a unique identifier.
2. **Individual State**: Use the store to maintain the state of each element, indexed by its unique identifier.
3. **Dynamic Overrides**: Overrides should access and modify the specific state of each element.

## Example: Collection Item Expand Override

```typescript
import { ComponentType } from "react"
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

interface ItemState {
  expanded: boolean
}

const useStore = createStore<{ [key: string]: ItemState }>({})

export function withExpandButton(Component): ComponentType {
  return (props) => {
    const [store, setStore] = useStore()
    const itemId = props.id || "defaultId"

    const toggleExpand = () => {
      setStore({
        ...store,
        [itemId]: { expanded: !store[itemId]?.expanded }
      })
    }

    return (
      <Component
        {...props}
        onClick={toggleExpand}
      />
    )
  }
}

export function withExpandableItem(Component): ComponentType {
  return (props) => {
    const [store] = useStore()
    const itemId = props.id || "defaultId"
    const expanded = store[itemId]?.expanded

    const style = {
      ...props.style,
      gridColumn: expanded ? "span 2" : "span 1"
    }

    return <Component {...props} style={style} />
  }
}
```

### Key Points of the Example

1. **Store Creation**: Use `createStore` to save the expansion state of each element, indexed by its ID.
2. **withExpandButton Override**:
   - Obtains the unique ID of the element.
   - Implements `toggleExpand` to toggle the expansion state of the specific element.
3. **withExpandableItem Override**:
   - Retrieves the expansion state of the specific element.
   - Dynamically modifies the style based on its expansion state.

## Best Practices Specific to Collections

1. **Handle Individual States**: Use an object in the store to manage individual states, with keys being the element IDs.
2. **Separate Logic and Presentation**: Separate the toggle logic (withExpandButton) from the presentation (withExpandableItem).
3. **Conditional Styles**: Apply styles dynamically based on the state of the individual element.

These patterns will allow you to create robust and flexible overrides to handle individual elements in collections, enabling complex interactions and dynamic states in your Framer prototypes.

import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

// Definir la interfaz para un elemento de la colección
interface CollectionItem {
    id: string
    title: string
    description: string
    image: string
}

// Definir las propiedades del componente
interface Props {
    items: CollectionItem[]
    filter: string
    layout: "grid" | "list"
    width: number
    height: number
}

/**
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 400
 * @framerDisableUnlink
 */
export function CustomCollectionList(props: Props) {
    const { items, filter, layout, width, height } = props

    // Aplicar filtro a los elementos
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.description.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <motion.div style={{ width, height, overflow: "auto" }}>
            <div style={{
                display: layout === "grid" ? "grid" : "flex",
                gridTemplateColumns: layout === "grid" ? "repeat(auto-fill, minmax(150px, 1fr))" : "1fr",
                flexDirection: layout === "grid" ? "row" : "column",
                gap: "10px"
            }}>
                {filteredItems.map(item => (
                    <div key={item.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                        <img src={item.image} alt={item.title} style={{ width: "100%", height: "auto" }} />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

CustomCollectionList.defaultProps = {
    items: [
        { id: "1", title: "Item 1", description: "Description 1", image: "https://via.placeholder.com/150" },
        { id: "2", title: "Item 2", description: "Description 2", image: "https://via.placeholder.com/150" },
    ],
    filter: "",
    layout: "grid",
    width: 300,
    height: 400,
}

addPropertyControls(CustomCollectionList, {
    items: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                id: { type: ControlType.String },
                title: { type: ControlType.String },
                description: { type: ControlType.String },
                image: { type: ControlType.Image },
            },
        },
    },
    filter: { type: ControlType.String },
    layout: {
        type: ControlType.Enum,
        options: ["grid", "list"],
        defaultValue: "grid",
    },
    width: { type: ControlType.Number },
    height: { type: ControlType.Number },
})
```
