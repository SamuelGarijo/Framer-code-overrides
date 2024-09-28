<tags>advanced-overrides, state-management, component-interaction</tags>

# Advanced Techniques for Framer Overrides

This document contains advanced techniques and examples for creating more robust and efficient Framer overrides.

## 1. Using TypeScript for Type-Safe Overrides

TypeScript can significantly enhance your override development by providing better type checking and IDE support:

```typescript
import type { ComponentType } from "react"

export function withTypedProps(Component): ComponentType<{ customProp: string }> {
    return (props) => {
        return <Component {...props} text={props.customProp} />
    }
}
```

This approach ensures type safety and improves autocompletion in your IDE.

## 2. Performance Optimization with useMemo and useCallback

For performance-critical overrides, implement memoization techniques:

```typescript
import { useMemo, useCallback } from "react"

export function withOptimizedComputation(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        const expensiveComputation = useMemo(() => {
            // Perform complex calculation here
            return someComplexCalculation(store.data)
        }, [store.data])

        const optimizedHandler = useCallback(() => {
            setStore({ result: expensiveComputation })
        }, [expensiveComputation])

        return <Component {...props} onClick={optimizedHandler} />
    }
}
```

This ensures that expensive calculations or functions are only re-run when necessary.

## 3. Integrating External API Calls

Incorporate data from external sources in your overrides:

```typescript
import { useEffect } from "react"
import axios from "axios"

export function withExternalData(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        useEffect(() => {
            axios.get("https://api.example.com/data")
                .then(response => setStore({ data: response.data }))
        }, [])

        return <Component {...props} text={store.data} />
    }
}
```

Remember to handle loading and error states appropriately when working with external data.

## 4. Advanced Variant Handling

Implement more sophisticated logic for variant switching:

```typescript
export function withAdvancedVariant(Component): ComponentType {
    return (props) => {
        const [store] = useStore()

        const getVariant = () => {
            if (store.count === 0) return "Empty"
            if (store.count < 5) return "Low"
            if (store.count < 10) return "Medium"
            return "High"
        }

        return <Component {...props} variant={getVariant()} />
    }
}
```

This allows for more nuanced UI states based on complex conditions.

## 5. Composing Multiple Overrides

Create more complex behaviors by composing multiple overrides:

```typescript
export const withComposedBehavior = compose(
    withCount,
    withIncrementCount,
    withDecrementCount
)
```

This approach allows for modular and reusable override combinations.

Remember, these advanced techniques should be used judiciously. Always prioritize readability and maintainability in your overrides, and only implement these patterns when they provide clear benefits to your Framer project.
```

You can now manually add this information to your base document, enhancing it with these advanced techniques and more detailed examples of using overrides in Framer.

## Complex State Management

When working with complex UI components, it's crucial to structure your store efficiently to handle various aspects of your UI state. Here's an example of how to structure a store for complex UI components:

```typescript
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

interface PriceData {
  month: string
  year: string
}

interface Prices {
  basic: PriceData
  premium: PriceData
  enterprise: PriceData
}

interface StoreState {
  period: "month" | "year"
  prices: Prices
  selectedPlan: "basic" | "premium" | "enterprise"
  currency: string
  isLoading: boolean
  error: string | null
}

const initialState: StoreState = {
  period: "month",
  prices: {
    basic: { month: "$24", year: "$249" },
    premium: { month: "$49", year: "$449" },
    enterprise: { month: "$1k", year: "$10k" },
  },
  selectedPlan: "basic",
  currency: "USD",
  isLoading: false,
  error: null,
}

const useStore = createStore(initialState)
```

This structure allows for a more comprehensive state management, including selected plans, currency, loading states, and error handling.

## Creating Sophisticated Interactions with Multiple Overrides

Overrides can work together to create more complex interactions. Here's an example of how multiple overrides can interact to create a dynamic pricing UI:

```typescript
export function withPlanSelector(Component): ComponentType {
  return (props) => {
    const [store, setStore] = useStore()
    return (
      <Component
        {...props}
        onClick={() => {
          const plans = ["basic", "premium", "enterprise"]
          const currentIndex = plans.indexOf(store.selectedPlan)
          const nextPlan = plans[(currentIndex + 1) % plans.length]
          setStore({ selectedPlan: nextPlan })
        }}
      />
    )
  }
}

export function withPriceDisplay(Component): ComponentType {
  return (props) => {
    const [store] = useStore()
    return (
      <Component
        {...props}
        text={store.prices[store.selectedPlan][store.period]}
      />
    )
  }
}

export function withCurrencyToggle(Component): ComponentType {
  return (props) => {
    const [store, setStore] = useStore()
    return (
      <Component
        {...props}
        onClick={() => {
          setStore({
            currency: store.currency === "USD" ? "EUR" : "USD",
            isLoading: true,
          })
          // Simulate API call to get new prices
          setTimeout(() => {
            setStore({
              isLoading: false,
              prices: {
                // Update prices based on new currency
                // This is a simplified example
              }
            })
          }, 1000)
        }}
      />
    )
  }
}

export function withLoadingIndicator(Component): ComponentType {
  return (props) => {
    const [store] = useStore()
    return store.isLoading ? <Component {...props} /> : null
  }
}
```

In this example, we have multiple overrides working together:
- `withPlanSelector` allows cycling through different plans
- `withPriceDisplay` shows the price based on the selected plan and period
- `withCurrencyToggle` changes the currency and triggers a simulated API call
- `withLoadingIndicator` shows a loading state during the currency change

These overrides, when applied to appropriate components, create a sophisticated pricing UI with plan selection, price display, currency switching, and loading states, all managed through a shared store.

Después de analizar profundamente los documentos base, especialmente "Advanced Techniques for Framer Overrides-Enhancing Performance, Type Safety, and", he encontrado que algunos conceptos se repiten. Aquí está una versión actualizada del documento, eliminando las partes redundantes y manteniendo solo la información nueva y valiosa:

```markdown
# Advanced Techniques for Interconnected Overrides in Framer

## Interconnected Overrides for Complex UI Components

When creating complex UI components, it's often necessary to have multiple overrides working together. This approach allows for more sophisticated interactions and state management across different parts of your UI.

### Creating Multiple Overrides for Complex UI Components

Interconnected overrides share a common state and work together to create a cohesive user experience. Here's an example of how to create interconnected overrides for a pricing component:

```typescript
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

const useStore = createStore({
  period: "month",
  prices: {
    basic: { month: "$24", year: "$249" },
    premium: { month: "$49", year: "$449" },
    enterprise: { month: "$1k", year: "$10k" },
  },
})

export function withTogglePeriod(Component): ComponentType {
  return (props) => {
    const [store, setStore] = useStore()
    const newPeriod = store.period === "month" ? "year" : "month"
    const variant = store.period === "month" ? "Monthly" : "Annual"
    return (
      <Component
        {...props}
        variant={variant}
        onClick={() => setStore({ period: newPeriod })}
      />
    )
  }
}

export function withBasicPrice(Component): ComponentType {
  return (props) => {
    const [store] = useStore()
    return <Component {...props} text={store.prices.basic[store.period]} />
  }
}
```

In this example, `withTogglePeriod` and `withBasicPrice` work together, sharing the same store to create a dynamic pricing UI.

## Design Principles for Interconnected Overrides

When creating interconnected overrides, consider the following principles:

1. **Modularity**: Create separate overrides for different aspects of your UI that react to the same state changes.
2. **Shared State**: Use a centralized store to manage state that needs to be accessed by multiple overrides.
3. **Single Responsibility**: Each override should be responsible for a specific aspect of the UI's behavior or appearance.
4. **Reusability**: Design your overrides to be as reusable as possible, even across different components or projects.
```


After carefully reviewing the base documents ("Nandi-Overrides", "Best-Practices-Overrides", and "Advanced Techniques interconnected Overrides") and comparing them with the newly created MD file, I found some overlapping concepts. Here's a revised version of the MD file, removing the repeated concepts and focusing solely on the unique information:

```markdown
# Advanced State Management and Component Interaction Techniques for Framer Overrides

This document introduces additional advanced techniques for managing state and component interactions in Framer Overrides, complementing the basic and intermediate concepts covered in other guides.

## 1. Centralized Store for Complex UI Components

While the concept of a centralized store has been introduced before, this section focuses on using it for more complex UI components with multiple interconnected parts.

```typescript
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0";

const useStore = createStore({
  mode: "grid",
  prices: {
    basic: { month: "$24", year: "$249" },
    premium: { month: "$49", year: "$449" },
    enterprise: { month: "$1k", year: "$10k" },
  },
  selectedPlan: "basic",
  period: "month",
});
```

This expanded store structure allows for more sophisticated state management, enabling multiple overrides to interact with various aspects of the UI state.

## 2. Variant Changes Based on Complex Store State

Extend the use of variants by basing them on more complex store states:

```typescript
export function withViewChange(Component): ComponentType {
  return (props) => {
    const [store] = useStore();
    const variant = `${store.mode}-${store.selectedPlan}-${store.period}`;
    return <Component {...props} variant={variant} />;
  };
};
```

## 3. Cascading State Changes

Implement overrides that trigger multiple state changes, affecting various parts of the UI:

```typescript
export function withPlanChange(Component): ComponentType {
  return (props) => {
    const [_, setStore] = useStore();
    return (
      <Component
        {...props}
        onClick={() => setStore((prev) => ({
          selectedPlan: prev.selectedPlan === "basic" ? "premium" : "basic",
          mode: prev.selectedPlan === "basic" ? "detailed" : "simple",
        }))}
      />
    );
  };
};
```

## 4. Dynamic Property Modification for External Components

Extend the concept of modifying external component properties by incorporating more complex logic:

```typescript
export function withDynamicIcon(Component): ComponentType {
  return (props) => {
    const [store, setStore] = useStore();
    const iconColor = store.mode === "grid"
      ? (store.selectedPlan === "premium" ? "#gold" : "#silver")
      : "rgba(0,0,0,0.6)";

    return (
      <Component
        {...props}
        onClick={() => setStore({ mode: "grid" })}
        color={iconColor}
        size={store.selectedPlan === "premium" ? 24 : 18}
      />
    );
  };
};
```
# Advanced Interconnected Overrides for Multiple Components

## Principles and Implementation

This section covers an advanced implementation of interconnected overrides across multiple components using a shared store. The key principles applied in this solution are:

1. **Centralized State Management**: Using a shared store to manage the state of multiple components simultaneously.
2. **Component Independence**: Maintaining individual override files for each component while allowing them to interact through the shared state.
3. **Dynamic State Updates**: Implementing state updates that affect multiple components based on the action of a single component.
4. **Consistent State Structure**: Using a uniform structure in the shared store for each component's state.

## Shared Store Implementation

The shared store (`sharedStore.ts`) manages the state for all components:

```typescript
// sharedStore.ts
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

export const useSharedStore = createStore({
    item1: { mode: "span 1", variant: "Variant 1" },
    item2: { mode: "span 1", variant: "Variant 1" },
    // ... repeat for item3 to item10
})
```

## CollItem Override Example

Here's an example of a CollItem override file (e.g., `CollItem1.tsx`):

```typescript
import type { ComponentType } from "react"
import { useSharedStore } from "./sharedStore"

export function withExpandableItem(Component): ComponentType {
    return (props) => {
        const [store] = useSharedStore()
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    gridColumn: store.item1.mode,
                }}
            />
        )
    }
}

export function withToggleExpandButton(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useSharedStore()

        const toggleExpandAndVariant = () => {
            const newMode = store.item1.mode === "span 1" ? "span 2" : "span 1"
            const newVariant = newMode === "span 2" ? "Variant 2" : "Variant 1"

            setStore(prevStore => {
                const newStore = { ...prevStore }
                Object.keys(newStore).forEach(key => {
                    if (key !== 'item1') {
                        newStore[key] = { mode: "span 1", variant: "Variant 1" }
                    }
                })
                newStore.item1 = { mode: newMode, variant: newVariant }
                return newStore
            })
        }

        return (
            <Component
                {...props}
                onClick={toggleExpandAndVariant}
                variant={store.item1.mode === "span 2" ? "Expanded" : "Default"}
            />
        )
    }
}

export function withVariantChange(Component): ComponentType {
    return (props) => {
        const [store] = useSharedStore()
        return <Component {...props} variant={store.item1.variant} />
    }
}
```

This implementation demonstrates how to create interconnected overrides that maintain individual component independence while allowing for complex interactions across multiple components. The shared store acts as a central point of truth, enabling each component to react to changes in others while maintaining its own logic and behavior.
```
