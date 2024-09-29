// CustomTooltip.tsx
import React, { useState, useEffect, useCallback, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function CustomTooltip({
    active = true, // Default active to true for testing in the canvas
    payload = [
        { payload: { value: 0, image: null } },
        { payload: { value: 0 } },
    ], // Default payload
    label = "Default Label", // Default label
    containerRef = { current: null }, // Fallback for containerRef
    backgroundColor = "#FFFFFF", // Default background color
    fontFamily = "'Courier New', monospace", // Default font family
    popupYearLabel = "Year", // Default popup label
    lineNames = { line1: "Value 1", line2: "Value 2" }, // Default line names
    yAxisDecimals = 2, // Default Y-axis decimals
    valueUnit = "", // Default value unit
}) {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 })
    const tooltipRef = useRef(null)

    // Tooltip logic: In the canvas, it may not be used, so no mouse events for now
    const handleMouseMove = useCallback(() => {
        // Empty implementation for canvas testing
    }, [])

    useEffect(() => {
        if (containerRef?.current) {
            containerRef.current.addEventListener("mousemove", handleMouseMove)
        }
        return () => {
            if (containerRef?.current) {
                containerRef.current.removeEventListener(
                    "mousemove",
                    handleMouseMove
                )
            }
        }
    }, [handleMouseMove, containerRef])

    // Render the tooltip when active
    if (active) {
        const { image } = payload[0]?.payload || {} // Ensure payload[0].payload exists
        return (
            <div
                ref={tooltipRef}
                style={{
                    position: "absolute",
                    top: `${adjustedPosition.y}px`,
                    left: `${adjustedPosition.x}px`,
                    backgroundColor: backgroundColor,
                    border: "2px solid #59483b",
                    padding: "12px",
                    borderRadius: "2px",
                    fontFamily: fontFamily,
                    fontWeight: "bold",
                    color: "#333",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 9999,
                    width: "fit-content",
                    minWidth: "164px",
                    whiteSpace: "normal",
                    marginTop: "10px",
                    pointerEvents: "none",
                }}
            >
                <p
                    style={{
                        fontWeight: "bold",
                        margin: "0 0 5px 0",
                        color: "#59483b",
                    }}
                >
                    {`${popupYearLabel}: ${label}`}
                </p>
                <p style={{ margin: "2px 0", color: "#333" }}>
                    {`${lineNames.line1}: ${payload[0]?.payload?.value != null ? payload[0].payload.value.toFixed(yAxisDecimals) : "N/A"} ${valueUnit}`}
                </p>
                <p style={{ margin: "2px 0", color: "#333" }}>
                    {`${lineNames.line2}: ${payload[1]?.payload?.value != null ? payload[1].payload.value.toFixed(yAxisDecimals) : "N/A"} ${valueUnit}`}
                </p>
                {image && (
                    <div style={{ marginTop: "10px" }}>
                        <img
                            src={image}
                            alt={`Image for ${label}`}
                            style={{
                                width: "100%",
                                maxHeight: "100px",
                                objectFit: "contain",
                                borderRadius: "4px",
                                border: "1px solid #333",
                            }}
                        />
                    </div>
                )}
            </div>
        )
    }
    return null
}

// Framer property controls
addPropertyControls(CustomTooltip, {
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Courier New', monospace",
    },
    popupYearLabel: {
        type: ControlType.String,
        title: "Year Label",
        defaultValue: "Year",
    },
    lineNames: {
        type: ControlType.Object,
        title: "Line Names",
        controls: {
            line1: { type: ControlType.String, title: "Line 1" },
            line2: { type: ControlType.String, title: "Line 2" },
        },
        defaultValue: { line1: "Value 1", line2: "Value 2" },
    },
    yAxisDecimals: {
        type: ControlType.Number,
        title: "Y Axis Decimals",
        defaultValue: 2,
        min: 0,
        max: 3,
    },
    valueUnit: {
        type: ControlType.String,
        title: "Value Unit",
        defaultValue: "",
    },
})

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 100
 */
