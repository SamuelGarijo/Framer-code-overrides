<tags>react-hooks, state-management, side-effects</tags>

# React Hooks in Framer Overrides

This document provides a concise overview of using React Hooks in Framer Overrides, focusing on the most commonly used hooks and their applications in Framer projects.

## useState

The `useState` hook is used for managing local state within a component or override.

```typescript
import { useState } from 'react'

export function withToggleState(Component): ComponentType {
    return (props) => {
        const [isActive, setIsActive] = useState(false)

        return (
            <Component
                {...props}
                onClick={() => setIsActive(!isActive)}
                variant={isActive ? "Active" : "Inactive"}
            />
        )
    }
}
```

## useEffect

The `useEffect` hook is used for side effects in components, such as subscribing to events or fetching data.

```typescript
import { useEffect, useState } from 'react'

export function withWindowSize(Component): ComponentType {
    return (props) => {
        const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

        useEffect(() => {
            const handleResize = () => {
                setWindowSize({ width: window.innerWidth, height: window.innerHeight })
            }

            window.addEventListener('resize', handleResize)
            handleResize() // Initial call

            return () => window.removeEventListener('resize', handleResize)
        }, [])

        return <Component {...props} windowSize={windowSize} />
    }
}
```

## useCallback

The `useCallback` hook is used to memoize functions, which can help optimize performance in certain scenarios.

```typescript
import { useCallback } from 'react'

export function withMemoizedCallback(Component): ComponentType {
    return (props) => {
        const handleClick = useCallback(() => {
            console.log('Button clicked')
            // Perform some action
        }, []) // Empty dependency array means this function is created once and reused

        return <Component {...props} onClick={handleClick} />
    }
}
```

## useMemo

The `useMemo` hook is used to memoize expensive computations, preventing unnecessary recalculations.

```typescript
import { useMemo } from 'react'

export function withExpensiveComputation(Component): ComponentType {
    return (props) => {
        const expensiveResult = useMemo(() => {
            // Perform and return result of expensive computation here
            return someExpensiveOperation(props.data)
        }, [props.data]) // Only recompute when props.data changes

        return <Component {...props} computedValue={expensiveResult} />
    }
}
```

## Custom Hooks

You can create custom hooks to encapsulate and reuse stateful logic across multiple overrides.

```typescript
import { useState, useEffect } from 'react'

function useMousePosition() {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return position
}

export function withMouseTracker(Component): ComponentType {
    return (props) => {
        const mousePosition = useMousePosition()

        return <Component {...props} mousePosition={mousePosition} />
    }
}
```

By leveraging these React Hooks in your Framer Overrides, you can create more dynamic, efficient, and reusable components in your Framer projects.
