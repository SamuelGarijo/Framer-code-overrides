import React, { useMemo, useCallback, useState, useEffect } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"
import { addPropertyControls, ControlType } from "framer"
import { useSharedStore } from "./sharedStore.tsx"
import { motion } from "framer-motion"

// Custom hook for chart data
const useChartData = (
    csvData: string | undefined,
    manualData:
        | Array<{ year: number; value1: number; value2: number }>
        | undefined,
    useCSV: boolean,
    highlightedPoints: Array<{ year: number; image?: string }>
) => {
    return useMemo(() => {
        const baseData = useCSV
            ? csvData
                ? csvData
                      .split("\n")
                      .slice(1)
                      .map((row) => {
                          const [year, value1, value2] = row.split(",")
                          return {
                              year: parseInt(year.trim()),
                              value1: parseFloat(value1.trim()),
                              value2: parseFloat(value2.trim()),
                          }
                      })
                      .filter(
                          (item) =>
                              !isNaN(item.year) &&
                              !isNaN(item.value1) &&
                              !isNaN(item.value2)
                      )
                : [] // Si csvData es undefined, devolvemos un array vacío
            : (manualData ?? []) // Si manualData es undefined, devolvemos un array vacío

        return baseData.map((item) => {
            const highlightedPoint = highlightedPoints.find(
                (point) => point.year === item.year
            )
            return {
                ...item,
                image: highlightedPoint?.image,
            }
        })
    }, [csvData, manualData, useCSV, highlightedPoints])
}

// Custom hook for chart styles
const useChartStyles = (props) => {
    const parseLineStyle = (styleObj) => {
        const { type, dashType } = styleObj
        const dashArray =
            dashType === "dashed" ? "5 5" : dashType === "dotted" ? "1 5" : ""
        return { type, dashArray }
    }

    const { type: line1Type, dashArray: line1DashArray } = parseLineStyle(
        props.lineStyles.line1
    )
    const { type: line2Type, dashArray: line2DashArray } = parseLineStyle(
        props.lineStyles.line2
    )

    return {
        axisStyle: {
            fontSize: props.axisFontSize,
            fontFamily: props.fontFamily,
            fontWeight: props.fontWeight,
            fill: props.fontColor,
        },
        line1Style: { type: line1Type, dashArray: line1DashArray },
        line2Style: { type: line2Type, dashArray: line2DashArray },
    }
}

const CustomDot = ({
    cx,
    cy,
    payload,
    dataKey,
    highlightedPoints,
    lineColors,
}) => {
    // Verifica si el punto está resaltado
    const isHighlighted = useMemo(
        () => highlightedPoints?.some((point) => point.year === payload.year),
        [highlightedPoints, payload.year]
    )

    // No renderiza el punto si no está resaltado
    if (!cx || !cy) return null

    const fillColor = dataKey === "value1" ? lineColors.line1 : lineColors.line2

    return (
        <motion.circle
            cx={cx}
            cy={cy}
            r={6}
            fill={fillColor}
            style={{
                cursor: isHighlighted ? "pointer" : "default",
                opacity: isHighlighted ? 1 : 0.2,
                pointerEvents: isHighlighted ? "auto" : "none",
            }}
            animate={
                isHighlighted
                    ? {
                          scale: [1, 2.7, 1],
                          y: [0, -3, 0],
                          filter: [
                              "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))",
                              "drop-shadow(0px 6px 10px rgba(0,0,0,0.5))",
                              "none",
                          ],
                      }
                    : {}
            }
            transition={
                isHighlighted
                    ? {
                          duration: 1.2,
                          repeat: 0,
                          ease: "easeInOut",
                      }
                    : {}
            }
        />
    )
}

// Custom dot component for LineChart
const CustomActiveDot = React.memo(
    ({
        cx,
        cy,
        payload,
        dataKey,
        onClick,
        activeDotSize,
        lineColors,
        highlightedPoints,
    }) => {
        const [store, setStore] = useSharedStore()

        // Check if this year is associated with a highlighted point
        const isHighlighted = useMemo(
            () =>
                highlightedPoints?.some(
                    (point) => point.year === payload.year && point.variantName
                ),
            [highlightedPoints, payload.year]
        )

        // Always show the dot if it's highlighted
        const dotStyle = useMemo(
            () => ({
                cursor: isHighlighted ? "pointer" : "default",
                filter: isHighlighted
                    ? "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"
                    : "none",
                opacity: isHighlighted ? 1 : 0, // Fully visible if highlighted, otherwise invisible
                pointerEvents: isHighlighted ? "auto" : "none", // Disable events if not highlighted
            }),
            [isHighlighted]
        )

        const handleClick = useCallback(() => {
            if (!highlightedPoints) return

            const highlightedPoint = highlightedPoints.find(
                (point) => point.year === payload.year
            )

            if (highlightedPoint) {
                const variant = highlightedPoint.variantName
                setStore({ ...store, variant: variant })

                if (onClick) {
                    onClick(payload, dataKey)
                }
            }
        }, [setStore, store, payload, dataKey, highlightedPoints, onClick])

        if (!cx || !cy || !lineColors) {
            return null
        }

        const fillColor =
            dataKey === "value1" ? lineColors.line1 : lineColors.line2

        return (
            <circle
                cx={cx}
                cy={cy}
                r={activeDotSize}
                fill={fillColor}
                style={dotStyle}
                onClick={handleClick}
                aria-label={`Data point at year ${payload.year}`}
            />
        )
    }
)

// Tooltip component
const MemoizedCustomTooltip = React.memo(
    ({ active, payload, label, props }) => {
        const [position, setPosition] = useState({ x: 0, y: 0 })

        const handleMouseMove = useCallback((event) => {
            const tooltipWidth = 230 // Ancho aproximado del tooltip
            const margin = 10 // Margen entre el cursor y el tooltip

            // Posición del ratón
            const xPos = event.clientX
            const yPos = event.clientY

            // Dimensiones del viewport para evitar colisiones con los bordes
            const viewportWidth = window.innerWidth

            // Ajuste del eje X si el tooltip se sale de la pantalla
            let adjustedX = xPos
            if (xPos + tooltipWidth / 2 > viewportWidth) {
                adjustedX = viewportWidth - tooltipWidth / 2 - margin
            } else if (xPos - tooltipWidth / 2 < 0) {
                adjustedX = tooltipWidth / 2 + margin
            }

            // Ajustamos la posición del tooltip
            setPosition({
                x: adjustedX,
                y: yPos + margin, // Posicionamos el tooltip debajo del cursor
            })
        }, [])

        // Manejamos el evento mousemove globalmente
        useEffect(() => {
            window.addEventListener("mousemove", handleMouseMove)
            return () => {
                window.removeEventListener("mousemove", handleMouseMove)
            }
        }, [handleMouseMove])

        // Renderizamos el tooltip solo si está activo y hay datos de payload
        if (active && payload && payload.length) {
            const { image } = payload[0].payload
            return (
                <div
                    style={{
                        position: "absolute",
                        top: `${position.y}px`, // Posicionar en Y según el ratón
                        left: `${position.x}px`, // Posicionar en X según el ratón
                        transform: "translateX(-50%)", // Centrar el tooltip horizontalmente
                        backgroundColor: props.backgroundColor,
                        border: `${props.axisLineWidth}px solid ${props.gridAndAxisColor}`,
                        padding: "10px",
                        borderRadius: "4px",
                        fontFamily: props.fontFamily,
                        fontWeight: props.fontWeight,
                        color: props.fontColor,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        zIndex: 9999, // Aseguramos que esté sobre otros elementos
                        maxWidth: "400px",
                        minWidth: "230px",
                        whiteSpace: "normal",
                    }}
                >
                    <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>
                        {`${props.popupYearLabel}: ${label}`}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                        {`${props.lineNames.line1}: ${payload[0].value.toFixed(
                            props.yAxisDecimals
                        )} ${props.valueUnit}`}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                        {`${props.lineNames.line2}: ${payload[1].value.toFixed(
                            props.yAxisDecimals
                        )} ${props.valueUnit}`}
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
                                }}
                            />
                        </div>
                    )}
                </div>
            )
        }
        return null
    }
)

// Main graph component
export function SimpleGraph(props: any) {
    const [_, setStore] = useSharedStore()
    const [store] = useSharedStore()

    const handleDotClick = useCallback(
        (payload: any, dataKey: string) => {
            const highlightedPoint = props.highlightedPoints.find(
                (point: any) => point.year === payload.year
            )
            const variant = highlightedPoint
                ? highlightedPoint.variantName
                : "closed"
            setStore.setSelectedPoint({
                year: payload.year,
                value: payload[dataKey],
                dataKey: dataKey,
            })
        },
        [setStore, props.highlightedPoints]
    )

    const chartData = useChartData(
        props.csvData,
        props.manualData,
        props.useCSV,
        props.highlightedPoints
    )
    const chartStyles = useChartStyles(props)

    const minValueX = useMemo(
        () => Math.min(...(chartData || []).map((item: any) => item.year)),
        [chartData]
    )

    const maxValueX = useMemo(
        () => Math.max(...(chartData || []).map((item: any) => item.year)),
        [chartData]
    )

    const maxValueY = useMemo(
        () =>
            Math.max(
                ...(chartData || []).map((item: any) =>
                    Math.max(item.value1, item.value2)
                )
            ),
        [chartData]
    )

    const minValueY = useMemo(
        () =>
            Math.min(
                ...(chartData || []).map((item: any) =>
                    Math.min(item.value1, item.value2)
                )
            ),
        [chartData]
    )

    const xAxisDomain = useMemo(
        () => [
            minValueX - (maxValueX - minValueX) * 0.1, // Margen del 10% a la izquierda
            maxValueX + (maxValueX - minValueX) * 0.1, // Margen del 10% a la derecha
        ],
        [minValueX, maxValueX]
    )

    const yAxisDomain = useMemo(
        () => [
            minValueY * 1.5, // Expande el valor mínimo hacia abajo (10% adicional)
            maxValueY * 1.1, // Expande el valor máximo hacia arriba (10% adicional)
        ],
        [minValueY, maxValueY]
    )

    return (
        <div style={{ width: "100%", height: "100%", ...props.style }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 0, right: 24, left: -24, bottom: 0 }}
                >
                    {props.showGrid && (
                        <CartesianGrid
                            stroke={props.gridAndAxisColor}
                            strokeWidth={0.5}
                        />
                    )}
                    <XAxis
                        dataKey="year"
                        type="number"
                        domain={xAxisDomain}
                        tick={chartStyles.axisStyle}
                        tickFormatter={(value) => value.toFixed(0)}
                        ticks={Array.from(
                            { length: props.xAxisSteps + 1 },
                            (_, i) =>
                                xAxisDomain[0] +
                                ((xAxisDomain[1] - xAxisDomain[0]) /
                                    props.xAxisSteps) *
                                    i
                        )}
                        axisLine={{
                            strokeWidth: props.axisLineWidth,
                            stroke: props.gridAndAxisColor,
                        }}
                        tickLine={{
                            strokeWidth: props.tickLineWidth,
                            stroke: props.gridAndAxisColor,
                        }}
                    />
                    <YAxis
                        type="number"
                        domain={yAxisDomain}
                        tick={chartStyles.axisStyle}
                        tickFormatter={(value) =>
                            value.toFixed(props.yAxisDecimals)
                        }
                        ticks={(() => {
                            const generatedTicks = Array.from(
                                { length: props.yAxisSteps + 1 },
                                (_, i) =>
                                    yAxisDomain[0] +
                                    ((yAxisDomain[1] - yAxisDomain[0]) /
                                        props.yAxisSteps) *
                                        i
                            )
                            console.log("Generated ticks:", generatedTicks) // Verificación de los ticks generados
                            return generatedTicks
                        })()}
                        axisLine={{
                            strokeWidth: props.axisLineWidth,
                            stroke: props.gridAndAxisColor,
                        }}
                        tickLine={{
                            strokeWidth: props.tickLineWidth,
                            stroke: props.gridAndAxisColor,
                        }}
                    />
                    <Tooltip
                        content={
                            <MemoizedCustomTooltip
                                props={props} // Todas las propiedades necesarias se pasan aquí
                                active={false} // Modificar según el estado activo del tooltip
                                payload={undefined} // Datos relevantes para el tooltip
                                label={""} // La etiqueta, si aplica
                            />
                        }
                        cursor={{
                            stroke: props.gridAndAxisColor,
                            strokeOpacity: 0.3,
                            strokeWidth: 1,
                        }}
                    />

                    <Line
                        key="line1"
                        type={chartStyles.line1Style.type}
                        dataKey="value1"
                        stroke={props.lineColors.line1}
                        strokeWidth={props.lineWidths.line1}
                        strokeDasharray={chartStyles.line1Style.dashArray}
                        activeDot={
                            <CustomActiveDot
                                onClick={handleDotClick}
                                activeDotSize={props.activeDotSize}
                                lineColors={props.lineColors}
                                dataKey="value1"
                                highlightedPoints={props.highlightedPoints}
                            />
                        }
                        dot={
                            <CustomDot
                                highlightedPoints={props.highlightedPoints}
                                lineColors={props.lineColors}
                                cx={undefined}
                                cy={undefined}
                                payload={undefined}
                                dataKey={undefined}
                            />
                        }
                    />
                    <Line
                        key="line2"
                        type={chartStyles.line2Style.type}
                        dataKey="value2"
                        stroke={props.lineColors.line2}
                        strokeWidth={props.lineWidths.line2}
                        strokeDasharray={chartStyles.line2Style.dashArray}
                        activeDot={
                            <CustomActiveDot
                                onClick={handleDotClick}
                                activeDotSize={props.activeDotSize}
                                lineColors={props.lineColors}
                                dataKey="value2"
                                highlightedPoints={props.highlightedPoints}
                            />
                        }
                        dot={
                            <CustomDot
                                highlightedPoints={props.highlightedPoints}
                                lineColors={props.lineColors}
                                cx={undefined}
                                cy={undefined}
                                payload={undefined}
                                dataKey={undefined}
                            />
                        }
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

addPropertyControls(SimpleGraph, {
    useCSV: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Use CSV Data",
    },
    csvData: {
        type: ControlType.String,
        defaultValue:
            "Year,Value1,Value2\n1953,110,60\n1954,95,75\n1955,120,65\n1956,195,85\n1957,180,90\n1958,220,120\n1959,350,160\n1960,400,190\n1961,450,195\n1962,480,200\n1963,500,220\n1964,560,230",
        displayTextArea: true,
        hidden: (props) => !props.useCSV,
        title: "Paste CSV",
    },
    manualData: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                year: { type: ControlType.Number },
                value1: { type: ControlType.Number },
                value2: { type: ControlType.Number },
            },
        },
        defaultValue: [
            { year: 1953, value1: 110, value2: 60 },
            { year: 1954, value1: 95, value2: 75 },
            { year: 1955, value1: 120, value2: 65 },
            { year: 1956, value1: 195, value2: 85 },
            { year: 1957, value1: 180, value2: 90 },
            { year: 1958, value1: 220, value2: 120 },
            { year: 1959, value1: 350, value2: 160 },
            { year: 1960, value1: 400, value2: 190 },
            { year: 1961, value1: 450, value2: 195 },
            { year: 1962, value1: 480, value2: 200 },
            { year: 1963, value1: 500, value2: 220 },
            { year: 1964, value1: 560, value2: 230 },
        ],
        hidden: (props) => props.useCSV,
        title: "Add Info",
    },
    axisFontSize: {
        type: ControlType.Number,
        defaultValue: 12,
        min: 8,
        max: 24,
        step: 1,
        title: "Font Size",
    },
    fontFamily: {
        type: ControlType.String,
        defaultValue: "Space Mono",
        title: "Font Family",
    },
    fontWeight: {
        type: ControlType.Enum,
        defaultValue: "normal",
        options: ["normal", "bold"],
        title: "Font Weight",
    },
    fontColor: {
        type: ControlType.Color,
        defaultValue: "#000000",
        title: "Font Color",
    },
    yAxisSteps: {
        type: ControlType.Number,
        defaultValue: 9,
        min: 2,
        max: 20,
        step: 1,
        title: "Y Steps",
    },
    xAxisSteps: {
        type: ControlType.Number,
        defaultValue: 5,
        min: 2,
        max: 20,
        step: 1,
        title: "X Steps",
    },
    valueUnit: { type: ControlType.String, defaultValue: "", title: "Units" },
    yAxisDecimals: {
        type: ControlType.Number,
        defaultValue: 1,
        min: 0,
        max: 3,
        step: 1,
        title: "Decimals",
    },
    backgroundColor: {
        type: ControlType.Color,
        defaultValue: "#FFFFFF",
        title: "Tooltip BG",
    },
    showGrid: { type: ControlType.Boolean, defaultValue: true, title: "Grid" },
    popupYearLabel: {
        type: ControlType.String,
        defaultValue: "X Value",
        title: "X Label",
    },
    lineColors: {
        type: ControlType.Object,
        defaultValue: { line1: "#BF0808", line2: "#0047AB" },
        controls: {
            line1: { type: ControlType.Color, title: "L.1" },
            line2: { type: ControlType.Color, title: "L.2" },
        },
        title: "Line Colors",
    },
    lineNames: {
        type: ControlType.Object,
        defaultValue: { line1: "Line Red Value", line2: "Line Blue Value" },
        controls: {
            line1: { type: ControlType.String, title: "L.1 Name" },
            line2: { type: ControlType.String, title: "L.2 Name" },
        },
        title: "Line Names",
    },
    lineWidths: {
        type: ControlType.Object,
        defaultValue: { line1: 5, line2: 5 },
        controls: {
            line1: {
                type: ControlType.Number,
                title: "L.1 Width",
                min: 1,
                max: 20,
                step: 1,
            },
            line2: {
                type: ControlType.Number,
                title: "L.2 Width",
                min: 1,
                max: 20,
                step: 1,
            },
        },
        title: "Line Widths",
    },
    lineStyles: {
        type: ControlType.Object,
        defaultValue: {
            line1: { type: "step", dashType: "solid" },
            line2: { type: "monotone", dashType: "dashed" },
        },
        controls: {
            line1: {
                type: ControlType.Object,
                title: "L.1 Style",
                controls: {
                    type: {
                        type: ControlType.Enum,
                        title: "L.1 Type",
                        options: ["monotone", "linear", "step", "natural"],
                        optionTitles: ["Monotone", "Linear", "Step", "Natural"],
                    },
                    dashType: {
                        type: ControlType.Enum,
                        title: "L.1 Dash",
                        options: ["solid", "dashed", "dotted"],
                        optionTitles: ["Solid", "Dashed", "Dotted"],
                    },
                },
            },
            line2: {
                type: ControlType.Object,
                title: "L.2 Style",
                controls: {
                    type: {
                        type: ControlType.Enum,
                        title: "L.2 Type",
                        options: ["monotone", "linear", "step", "natural"],
                        optionTitles: ["Monotone", "Linear", "Step", "Natural"],
                    },
                    dashType: {
                        type: ControlType.Enum,
                        title: "L.2 Dash",
                        options: ["solid", "dashed", "dotted"],
                        optionTitles: ["Solid", "Dashed", "Dotted"],
                    },
                },
            },
        },
        title: "Line Styles",
    },
    gridAndAxisColor: {
        type: ControlType.Color,
        defaultValue: "#000000",
        title: "Grid Color",
    },
    controlVisibility: {
        type: ControlType.Boolean,
        defaultValue: true,
        title: "Control Tooltip Visibility",
    },
    highlightedPoints: {
        type: ControlType.Array,
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                year: { type: ControlType.Number, defaultValue: 1961 },
                image: {
                    type: ControlType.Image,
                },
                variantName: {
                    type: ControlType.Enum,
                    defaultValue: "open1",
                    options: [
                        "open1",
                        "open2",
                        "open3",
                        "open4",
                        "open5",
                        "open6",
                        "open7",
                        "open8",
                        "open9",
                        "open10",
                    ],
                    optionTitles: [
                        "Open 1",
                        "Open 2",
                        "Open 3",
                        "Open 4",
                        "Open 5",
                        "Open 6",
                        "Open 7",
                        "Open 8",
                        "Open 9",
                        "Open 10",
                    ],
                },
            },
        },
        defaultValue: [
            {
                year: 1961,
                variantName: "open1",
            },
        ],
        title: "Key Points",
    },
    onPointClick: { type: ControlType.EventHandler },
    activeDotSize: {
        type: ControlType.Number,
        defaultValue: 8,
        min: 4,
        max: 20,
        step: 1,
        title: "Active Dot Size",
    },
})

export default SimpleGraph
