<tags>advanced-state, rendering-optimization, hooks</tags>

# Advanced State Management and Rendering in Framer Overrides

This document covers advanced techniques for managing state and optimizing rendering in Framer overrides.

## Custom Hooks

Custom hooks are a powerful way to extract component logic into reusable functions. In Framer overrides, custom hooks can help manage complex state logic and side effects.

Example:

```typescript
import { useState, useEffect } from 'react'
import { useSharedStore } from './sharedStore'

function useItemState(itemNumber: number) {
    const [store, setStore] = useSharedStore()
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        setIsExpanded(store.items[`item${itemNumber}`].mode === 'span 2')
    }, [store.items, itemNumber])

    const toggleExpand = () => {
        setStore((prevStore) => ({
            ...prevStore,
            items: {
                ...prevStore.items,
                [`item${itemNumber}`]: {
                    ...prevStore.items[`item${itemNumber}`],
                    mode: isExpanded ? 'span 1' : 'span 2'
                }
            }
        }))
    }

    return { isExpanded, toggleExpand }
}
```

This custom hook encapsulates the logic for managing the expanded state of an item, making it easy to reuse across multiple components.

## Conditional Rendering

Conditional rendering in Framer overrides allows you to dynamically change what's displayed based on the current state.

Example:

```typescript
export function withConditionalContent(Component): ComponentType {
    return (props) => {
        const { isExpanded } = useItemState(props.itemNumber)

        return (
            <Component {...props}>
                {isExpanded ? (
                    <div>Expanded content goes here</div>
                ) : (
                    <div>Collapsed content goes here</div>
                )}
            </Component>
        )
    }
}
```

This override changes the content of the component based on whether it's expanded or not.

## Reusable Logic

Creating reusable logic helps maintain consistency and reduces code duplication. Here's an example of a reusable function for updating item states:

```typescript
function updateItemState(store, itemNumber, updates) {
    return {
        ...store,
        items: {
            ...store.items,
            [`item${itemNumber}`]: {
                ...store.items[`item${itemNumber}`],
                ...updates
            }
        }
    }
}

export function withItemUpdate(Component): ComponentType {
    return (props) => {
        const [_, setStore] = useSharedStore()

        const updateItem = (updates) => {
            setStore((prevStore) => updateItemState(prevStore, props.itemNumber, updates))
        }

        return <Component {...props} updateItem={updateItem} />
    }
}
```

This reusable logic can be used across different overrides to update item states consistently.

## Performance Optimization

Performance optimization in Framer overrides often involves minimizing unnecessary re-renders and expensive computations.

Example using `useMemo` and `useCallback`:

```typescript
import { useMemo, useCallback } from 'react'

export function withOptimizedItem(Component): ComponentType {
    return (props) => {
        const { isExpanded } = useItemState(props.itemNumber)

        const expensiveComputation = useMemo(() => {
            // Perform and return result of expensive computation here
        }, [isExpanded]) // Only recompute when isExpanded changes

        const handleClick = useCallback(() => {
            // Handle click event
        }, []) // Empty dependency array means this function is created once and reused

        return <Component {...props} computed={expensiveComputation} onClick={handleClick} />
    }
}
```

In this example, `useMemo` is used to memoize the result of an expensive computation, while `useCallback` is used to memoize a function. This prevents unnecessary recalculations and re-renders, optimizing the performance of your Framer overrides.
