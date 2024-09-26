import { addPropertyControls, ControlType, Data, Override } from "framer"
import { useMemo, useEffect, useCallback, useRef, useState } from "react"
import React from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"
import { useSharedStore } from "./sharedStore_2.ts"
import { props } from "lodash/fp"

const axisLineWidth = 2 // Define el grosor de la línea de los ejes
const tickLineWidth = 1 // Define el grosor de las líneas de las marcas

const infoState = Data({
    currentVariant: "closed",
})

const handlePointClick = (infoVariant: string) => {
    infoState.currentVariant = infoVariant
}

const addOpacity = (color: string, opacity = 0.1): string => {
    if (color.startsWith("#")) {
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    if (color.startsWith("rgb")) {
        return color.replace("rgb", "rgba").replace(")", `, ${opacity})`)
    }
    return color
}

const parseLine2Style = (combinedStyle: string) => {
    const [lineType, dashType] = combinedStyle.split("-")
    const dashArray =
        dashType === "dashed" ? "5 5" : dashType === "dotted" ? "1 5" : ""
    return { lineType, dashArray }
}

interface HighlightedPoint {
    year: number
    image: string
    infoVariant: string
}

interface DataPoint {
    year: number
    value1: number
    value2: number
    image?: string
    link?: string
}

interface RetroDiagramWithImagesProps {
    axisLineWidth: any
    csvData: string
    manualData: DataPoint[]
    useCSV: boolean
    line1Color: string
    line2Color: string
    line1HoverColor: string
    line2HoverColor: string
    axisFontSize: number
    fontFamily: string
    fontWeight: "normal" | "bold"
    yAxisSteps: number
    xAxisSteps: number
    valueUnit: string
    line1Style: string
    line2Style: string
    yAxisDecimals: number
    backgroundColor: string
    showGrid: boolean
    popupYearLabel: string
    line1Name: string
    line2Name: string
    line1Width: number
    line2Width: number
    gridAndAxisColor: string
    fontColor: string
    highlightedPoints: HighlightedPoint[]
    onPointClick: (infoVariant: string) => void
}

export function RetroDiagramWithImages(props: RetroDiagramWithImagesProps) {
    const {
        useCSV = false,
        csvData = "",
        manualData = [],
        line1Color,
        line2Color,
        line1HoverColor,
        line2HoverColor,
        axisFontSize,
        fontFamily,
        fontWeight,
        yAxisSteps,
        xAxisSteps,
        valueUnit,
        line1Style,
        line2Style,
        yAxisDecimals,
        backgroundColor,
        showGrid,
        popupYearLabel,
        line1Name,
        line2Name,
        line1Width,
        line2Width,
        gridAndAxisColor,
        fontColor,
    } = props

    const [showClickInfo, setShowClickInfo] = useState(false)
    const hoverTimerRef = useRef<number | null>(null)

    const handleMouseEnter = useCallback(() => {
        hoverTimerRef.current = window.setTimeout(() => {
            setShowClickInfo(true)
        }, 2000)
    }, [])

    const handleMouseLeave = useCallback(() => {
        if (hoverTimerRef.current !== null) {
            window.clearTimeout(hoverTimerRef.current)
        }
        setShowClickInfo(false)
    }, [])

    const handlePointClick = useCallback((infoVariant: string) => {
        useSharedStore.currentVariant = infoVariant
    }, [])

    const CustomizedDot = useCallback(
        (props: any) => {
            const { cx, cy, payload } = props
            const { infoVariant } = payload

            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill={props.fill}
                    style={{ cursor: "pointer" }}
                    onClick={() => infoVariant && handlePointClick(infoVariant)}
                />
            )
        },
        [handlePointClick]
    )

    const parsedData = useMemo(() => {
        const baseData = useCSV
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
            : manualData

        return baseData.map((item) => {
            const highlightedPoint = props.highlightedPoints.find(
                (point) => point.year === item.year
            )
            return {
                ...item,
                image: highlightedPoint?.image,
                link: highlightedPoint?.link,
            }
        })
    }, [csvData, manualData, useCSV, props.highlightedPoints])

    const maxValue = Math.max(
        ...parsedData.map((item) => Math.max(item.value1, item.value2))
    )

    console.log("Parsed Data:", parsedData)
    console.log("Max Value:", maxValue)

    const yAxisDomain = [0, maxValue]

    const { lineType: line1Type, dashArray: line1DashArray } =
        parseLine2Style(line1Style)
    const { lineType: line2Type, dashArray: line2DashArray } =
        parseLine2Style(line2Style)

    const axisStyle = useMemo(() => {
        return {
            fontSize: axisFontSize,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            fill: fontColor,
        }
    }, [axisFontSize, fontFamily, fontWeight, fontColor])

    useEffect(() => {
        // Este efecto se ejecutará cada vez que cambie el estilo de texto
        // Aquí podrías realizar cualquier actualización adicional si fuera necesario
    }, [axisStyle])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { image, infoVariant } = payload[0].payload
            return (
                <div
                    style={{
                        backgroundColor: backgroundColor,
                        border: `${props.axisLineWidth}px solid ${gridAndAxisColor}`,
                        padding: "10px",
                        borderRadius: "0px",
                        fontFamily: fontFamily,
                        fontWeight: fontWeight,
                        color: fontColor,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>
                        {`${popupYearLabel}: ${label}`}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                        {`${line1Name}: ${payload[0].value.toFixed(yAxisDecimals)} ${valueUnit}`}
                    </p>
                    <p style={{ margin: "2px 0" }}>
                        {`${line2Name}: ${payload[1].value.toFixed(yAxisDecimals)} ${valueUnit}`}
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
                    {showClickInfo && infoVariant && (
                        <div style={{ marginTop: "10px", fontStyle: "italic" }}>
                            Click for more info
                        </div>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                fontFamily: fontFamily,
                fontWeight: fontWeight,
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={parsedData}
                    margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                >
                    {showGrid && (
                        <CartesianGrid
                            stroke={gridAndAxisColor}
                            strokeWidth={0.5}
                        />
                    )}
                    <XAxis
                        dataKey="year"
                        type="number"
                        domain={[
                            Math.min(...parsedData.map((item) => item.year)),
                            Math.max(...parsedData.map((item) => item.year)),
                        ]}
                        // Modificado: Aplicar axisStyle directamente como un objeto
                        tick={axisStyle}
                        tickFormatter={(value) => value.toFixed(0)}
                        ticks={Array.from(
                            { length: xAxisSteps + 1 },
                            (_, i) =>
                                Math.min(
                                    ...parsedData.map((item) => item.year)
                                ) +
                                ((Math.max(
                                    ...parsedData.map((item) => item.year)
                                ) -
                                    Math.min(
                                        ...parsedData.map((item) => item.year)
                                    )) /
                                    xAxisSteps) *
                                    i
                        )}
                        axisLine={{
                            strokeWidth: axisLineWidth,
                            stroke: gridAndAxisColor,
                        }}
                        tickLine={{
                            strokeWidth: tickLineWidth,
                            stroke: gridAndAxisColor,
                        }}
                    />
                    <YAxis
                        type="number"
                        domain={yAxisDomain}
                        // Modificado: Aplicar axisStyle directamente como un objeto
                        tick={axisStyle}
                        tickFormatter={(value) => value.toFixed(yAxisDecimals)}
                        ticks={Array.from(
                            { length: yAxisSteps + 1 },
                            (_, i) => (maxValue / yAxisSteps) * i
                        )}
                        axisLine={{
                            strokeWidth: axisLineWidth,
                            stroke: gridAndAxisColor,
                        }}
                        tickLine={{
                            strokeWidth: tickLineWidth,
                            stroke: gridAndAxisColor,
                        }}
                    />
                    <Tooltip
                        content={
                            <CustomTooltip
                                active={undefined}
                                payload={undefined}
                                label={undefined}
                            />
                        }
                        cursor={{
                            stroke: addOpacity(gridAndAxisColor),
                            strokeWidth: 1,
                        }}
                        offset={24}
                    />
                    <Line
                        type={line1Type}
                        dataKey="value1"
                        stroke={line1Color}
                        activeDot={{ r: 8, fill: line1HoverColor }}
                        dot={false}
                        strokeWidth={line1Width}
                        name={line1Name}
                        strokeDasharray={line1DashArray}
                    />
                    <Line
                        type={line2Type}
                        dataKey="value2"
                        stroke={line2Color}
                        activeDot={{ r: 8, fill: line2HoverColor }}
                        dot={false}
                        strokeWidth={line2Width}
                        name={line2Name}
                        strokeDasharray={line2DashArray}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

RetroDiagramWithImages.defaultProps = {
    width: 400,
    height: 400,
    textStyle: {
        family: "Space Mono",
        style: "Regular",
    },
}

addPropertyControls(RetroDiagramWithImages, {
    useCSV: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Use CSV Data",
    },
    csvData: {
        type: ControlType.String,
        defaultValue:
            "Year,Ocean,Gulf\n1953,110,60\n1954,95,75\n1955,120,65\n1956,195,85\n1957,180,90\n1958,220,120\n1959,350,160\n1960,400,190\n1961,450,195\n1962,480,200\n1963,500,220\n1964,560,230",
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
    valueUnit: {
        type: ControlType.String,
        defaultValue: "",
        title: "Units",
    },
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
    showGrid: {
        type: ControlType.Boolean,
        defaultValue: true,
        title: "Grid",
    },
    popupYearLabel: {
        type: ControlType.String,
        defaultValue: "X Value",
        title: "X Label",
    },
    line1Color: {
        type: ControlType.Color,
        defaultValue: "#BF0808",
        title: "L.1",
    },
    line2Color: {
        type: ControlType.Color,
        defaultValue: "#0047AB",
        title: "L.2",
    },
    line1HoverColor: {
        type: ControlType.Color,
        defaultValue: "#FF0000",
        title: "L.1 Hover",
    },
    line2HoverColor: {
        type: ControlType.Color,
        defaultValue: "#0054CA",
        title: "L.2 Hover",
    },
    line1Name: {
        type: ControlType.String,
        defaultValue: "Line Red Value",
        title: "L.1 Name",
    },
    line2Name: {
        type: ControlType.String,
        defaultValue: "Line Blue Value",
        title: "L.2 Name",
    },
    line1Style: {
        type: ControlType.Enum,
        defaultValue: "linear-dashed",
        options: [
            "monotone-solid",
            "monotone-dashed",
            "linear-solid",
            "linear-dashed",
            "step-solid",
            "step-dashed",
        ],
        optionTitles: [
            "monotone-solid",
            "monotone-dashed",
            "linear-solid",
            "linear-dashed",
            "step-solid",
            "step-dashed",
        ],
        title: "L.1 Style",
    },
    line2Style: {
        type: ControlType.Enum,
        defaultValue: "linear-dashed",
        options: [
            "monotone-solid",
            "monotone-dashed",
            "linear-solid",
            "linear-dashed",
            "step-solid",
            "step-dashed",
        ],
        optionTitles: [
            "monotone-solid",
            "monotone-dashed",
            "linear-solid",
            "linear-dashed",
            "step-solid",
            "step-dashed",
        ],
        title: "L.2 Style",
    },
    line1Width: {
        type: ControlType.Number,
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1,
        title: "L.1 Width",
    },
    line2Width: {
        type: ControlType.Number,
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1,
        title: "L.2 Width",
    },
    gridAndAxisColor: {
        type: ControlType.Color,
        defaultValue: "#000000",
        title: "Lines Color",
    },
    highlightedPoints: {
        type: ControlType.Array,
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                year: { type: ControlType.Number },
                image: { type: ControlType.Image },
                infoVariant: {
                    type: ControlType.Enum,
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
                    defaultValue: "open1",
                },
            },
        },
        defaultValue: [],
        title: "Highlighted Points",
    },
})

export default RetroDiagramWithImages
