<tags>overrides, framer, react, state-management</tags>

Comprehensive Guide to Framer Code Overrides


Code Overrides
Code Overrides are React higher-order components (HOCs) that allow you to modify properties of existing elements on the canvas. They are useful for adding animations, logic, and interactions to pre-existing elements.

Key Points:
Code Overrides are written in TypeScript.
They are applied to elements by selecting the file name from the ’Code Overrides’ dropdown in Framer.
Avoid using generics; Framer does the type checking itself.
Use the withFunctionName naming convention for higher-order components.
Example Code Override:
import type { ComponentType } from "react";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function withLowerOpacity(Component): ComponentType {

  return (props) => {

    return <Component {...props} opacity={0.5} />;

  };

}

Changing CSS Property with Override:
import type { ComponentType } from "react";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function ChangeColor(Component): ComponentType {

  return (props) => {

    const { style, ...rest } = props;

    return (

      <Component {...rest} style={{ ...style, backgroundColor: "Red" }} />

    );

  };

}

Writing Custom Code Overrides
Import Necessary Modules:
Import ComponentType from React.
Define the Override Function:
Use higher-order component syntax.
Spread Props Correctly:
Ensure all props are passed correctly to the component.
Example Override with State:
import type { ComponentType } from "react";

import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


const useStore = createStore({

    variant: "1",

});


export function changeVariant1(Component): ComponentType {

  return (props) => {

    const [store, setStore] = useStore();


    const changeVariant = () => {

      setStore({ variant: "1" });

    };


    return <Component {...props} onMouseEnter={changeVariant} />;

  };

}

# Additional Information for Framer Overrides

This document contains new and relevant information about Framer Overrides that can be incorporated into the base document. It includes examples of using Framer Motion, more detailed override examples, advanced usage of createStore, Framer utilities, and additional best practices.

## 1. Using Framer Motion in Overrides

Framer Motion is a powerful library for creating animations in Framer. Here's how you can use it in your overrides:

```typescript
import { motion } from "framer-motion"
import type { ComponentType } from "react"

export function withRotate(Component): ComponentType {
    return (props) => {
        return (
            <Component
                {...props}
                animate={{ rotate: 90 }}
                transition={{ duration: 2 }}
            />
        )
    }
}
```

This override rotates the component 90 degrees over 2 seconds.

## 2. Detailed Override Examples

### 2.1 Interaction Override

```typescript
export function withHover(Component): ComponentType {
    return (props) => {
        return <Component {...props} whileHover={{ scale: 1.05 }} />
    }
}
```

This override scales the component to 1.05 times its size when hovered.

### 2.2 State and Animation Combination

```typescript
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"
import { randomColor } from "https://framer.com/m/framer/utils.js@^0.9.0"

const useStore = createStore({
    background: "#0099FF",
})

export function withRandomColor(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        return (
            <Component
                {...props}
                animate={{
                    background: store.background,
                }}
                onClick={() => {
                    setStore({ background: randomColor() })
                }}
            />
        )
    }
}
```

This override changes the background color to a random color when clicked, using shared state to manage the current color.

## 3. Advanced Usage of createStore

The `createStore` function can be used for more complex state management across multiple overrides:

```typescript
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

const useStore = createStore({
    mode: "light",
    count: 0,
})

export function withToggleMode(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()
        return (
            <Component
                {...props}
                onClick={() => setStore({ mode: store.mode === "light" ? "dark" : "light" })}
            />
        )
    }
}

export function withIncrementCount(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()
        return (
            <Component
                {...props}
                onClick={() => setStore({ count: store.count + 1 })}
            >
                {store.count}
            </Component>
        )
    }
}
```

This example shows how to use `createStore` to manage multiple pieces of state that can be accessed and modified by different overrides.

## 4. Framer Utilities

Framer provides utility functions that can be useful in overrides:

```typescript
import { randomColor } from "https://framer.com/m/framer/utils.js@^0.9.0"

export function withRandomBackground(Component): ComponentType {
    return (props) => {
        return (
            <Component
                {...props}
                style={{ ...props.style, backgroundColor: randomColor() }}
            />
        )
    }
}
```

This override uses the `randomColor()` utility function to set a random background color.


## Interconnected Overrides

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

## Enhanced createStore Example

Here's an example of a more complex store structure that can be used for interconnected overrides:

```typescript
const useStore = createStore({
  period: "month",
  prices: {
    basic: { month: "$24", year: "$249" },
    premium: { month: "$49", year: "$449" },
    enterprise: { month: "$1k", year: "$10k" },
  },
  selectedPlan: "basic",
  currency: "USD",
})
```

This store structure allows for more sophisticated state management, enabling multiple overrides to interact with various aspects of the UI state.
```
