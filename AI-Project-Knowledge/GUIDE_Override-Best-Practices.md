<tags>best-practices, code-structure, optimization</tags>

# Best Practices for Overrides in Framer

## Basic Structure of an Override

```javascript
import type { ComponentType } from "react"

export function withHover(Component): ComponentType {
  return (props) => {
    return <Component {...props} whileHover={{ scale: 1.1 }} />
  }
}
This is a basic example of an override that scales a component to 110% when hovered over.
Best Practices for Code

Clear Naming: Use descriptive names for override functions. For example, withHover clearly indicates that the override adds a hover effect.
Modular Code: Break down complex overrides into smaller, reusable functions.
Avoid Hardcoding: Use variables for values that might change, instead of coding them directly in multiple places.
Error Handling: Include error handling in your overrides to manage unexpected situations.
Documentation and Comments: Document each change and add comments where the function name isn't sufficiently explanatory.

Debugging the Code

Using console.log: Utilize console.log to print values and messages that help you track the flow of the code.
Temporary Disabling: Comment out parts of the code to isolate problems during debugging.
Typographical Error Check: Carefully review variable names, function names, and property names to avoid typing errors.

## How to use overrides

Overrides enable you to modify Framer's behavior beyond its interface capabilities. They are code snippets that let you alter an element's properties programmatically.

Creation
Your project can store multiple separate files with overrides, allowing you to organize them as desired or easily move them between projects. To recognize your overrides in the code, Framer utilizes the TypeScript type system. Therefore, you need to decorate your exported functions as ComponentType.

import type { ComponentType } from "react”

export function withLink(Component): ComponentType { ... }
You can name your override however you prefer, but conventionally we like to prefix the name with "withTapAnimation", "withBlueColor", or "withCurrentTime". Components are motion-enabled elements (e.g., motion.div) and support all the capabilities of Motion by default. They are ideal for creating fast animations and effects.

Link override
Overrides can also change the structure. Here we wrap the component inside of a link element.

export function withLink(Component): ComponentType {
  return (props) => {
    return (
      <a href="<http://koenbok.com>"> <Component {...props} /> </a>
    )
  }
}
Note: Overrides cannot have props, so sometimes you need to create a new override for each unique value, such as a URL.

Additional Best Practices

Use overrides for specific purposes:

Animations: Use Framer Motion for smooth, performant animations.
Interactions: Implement hover effects, clicks, and other user interactions.
State changes: Manage and update component state based on user actions or other triggers.


Compose multiple overrides:
typescriptCopyexport const withComposedBehavior = compose(
    withRandomColor,
    withHover,
    withRotate
)

This allows you to combine multiple overrides to create more complex behaviors.
Use TypeScript for better type checking and autocompletion:
typescriptCopyimport type { ComponentType } from "react"

interface Props {
    customProp: string
}

export function withTypedProps(Component): ComponentType<Props> {
    return (props) => {
        return <Component {...props} text={props.customProp} />
    }
}
This ensures type safety and better IDE support.

By incorporating these additional points and examples into your base document, you'll have a more comprehensive guide to creating and using Framer Overrides.

## Creating Modular Overrides for UI Components

When working with complex UI components, it's a best practice to create modular overrides that react to the same shared state. This approach enhances code organization and reusability.

### Best Practice: Modular Overrides

Create separate overrides for different aspects of your UI that react to the same state changes. This allows for better code organization and easier maintenance.

Example:

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

export function withPeriodToggle(Component): ComponentType {
  return (props) => {
    const [store, setStore] = useStore()
    return (
      <Component
        {...props}
        onClick={() => setStore({ period: store.period === "month" ? "year" : "month" })}
      />
    )
  }
}

export function withPriceDisplay(Component): ComponentType {
  return (props) => {
    const [store] = useStore()
    return <Component {...props} text={store.prices[props.plan][store.period]} />
  }
}

export function withPeriodLabel(Component): ComponentType {
  return (props) => {
    const [store] = useStore()
    return <Component {...props} text={store.period === "month" ? "Monthly" : "Yearly"} />
  }
}
```

In this example, we have separate overrides for toggling the period, displaying the price, and updating the period label. All these overrides react to the same shared state, creating a cohesive and modular structure.

### Structuring Interconnected Overrides

To maintain organized code when working with interconnected overrides:

1. Group related overrides in the same file or module.
2. Use a consistent naming convention (e.g., `with[Feature]` for all overrides).
3. Keep the shared store in a separate file for easy imports and maintenance.
4. Use TypeScript interfaces to define the structure of your store for better type checking.

This approach allows for easier testing, maintenance, and scalability of your Framer overrides.

## Advanced Optimization and Best Practices

### Parametrization

Parametrization involves using constants or variables to make your overrides more flexible and easier to maintain. This technique is especially useful when creating multiple similar overrides.

```typescript
const ITEM_NUMBER = 1;
const TOP_OFFSET_VH = 8; // 8vh

export function withExpandableItem(Component): ComponentType {
    return (props) => {
        const { itemState, topOffset } = useItemState(ITEM_NUMBER)

        // ... rest of the component logic

        return (
            <Component
                {...props}
                style={style}
                id={`item${ITEM_NUMBER}`}
            />
        )
    }
}
```

Benefits of parametrization:
1. Easier to create multiple similar overrides by changing a single constant.
2. Improves code readability and maintainability.
3. Allows for quick adjustments to multiple components simultaneously.

### Component Identification

Assigning unique identifiers to your components can greatly enhance their manageability, especially in complex layouts or when implementing features like scrolling to specific elements.

```typescript
export function withIdentifiableComponent(Component): ComponentType {
    return (props) => {
        const { id, ...rest } = props;

        return (
            <Component
                {...rest}
                id={id || `component-${Math.random().toString(36).substr(2, 9)}`}
            />
        )
    }
}
```

Benefits of component identification:
1. Enables targeted manipulation of specific components.
2. Facilitates implementation of features like scroll-to-element.
3. Aids in debugging by making it easier to identify specific components in the DOM.

When using component identification:
- Ensure IDs are unique across your entire Framer project.
- Consider using a consistent naming convention for your IDs.
- Use these IDs in conjunction with other overrides, such as scroll management or state updates.

By implementing these advanced optimization techniques and best practices, you can create more robust, maintainable, and efficient Framer overrides.
```
