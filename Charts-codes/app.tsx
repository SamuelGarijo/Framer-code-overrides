import "./index.css";
import { bars } from "./chart-data-points";
import { barWidth, getY, getX, tooltipOffset } from "./chart-utils";
import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

function App() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const tooltipData = useMemo(() => {
    if (activeBarIndex === null) return null;
    return [...bars[activeBarIndex].data].reverse();
  }, [activeBarIndex]);

  useEffect(() => {
    if (!activeSection) return;
    document
      .querySelector(`.legend-item-${activeSection}`)
      ?.scrollIntoView({ block: "nearest", inline: "start" });
  }, [activeSection]);

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-slate-400">
      <div ref={wrapperRef} className="relative touch-none select-none">
        <svg
          onPointerMove={(event) => {
            const svgPosition = event.currentTarget.getBoundingClientRect();
            const xOverSvg = event.clientX - svgPosition.left + tooltipOffset;
            const yOverSvg = event.clientY - svgPosition.top - tooltipOffset;

            if (!wrapperRef.current) return;

            wrapperRef.current.style.setProperty("--x", `${xOverSvg}px`);
            wrapperRef.current.style.setProperty("--y", `${yOverSvg}px`);
          }}
          className="h-[400px] w-[600px] max-w-full rounded-xl bg-gray-600 shadow-lg"
        >
          {bars.map((bar, barIndex) => (
            <g
              onPointerEnter={() => setActiveBarIndex(barIndex)}
              onPointerLeave={() => setActiveBarIndex(null)}
              key={bar.name}
            >
              {bar.data.map((barSection, sectionIndex) => (
                <rect
                  onPointerDown={(event) => {
                    (event.target as Element).releasePointerCapture(
                      event.pointerId
                    );
                  }}
                  onPointerEnter={() => setActiveSection(barSection.name)}
                  onPointerLeave={() => setActiveSection(null)}
                  className="cursor-pointer stroke-gray-600"
                  key={barSection.name}
                  x={getX(barIndex)}
                  y={getY(barSection.value, sectionIndex, bar.data)}
                  width={barWidth}
                  height={barSection.value}
                  fill={barSection.color}
                  rx="2"
                />
              ))}
            </g>
          ))}
        </svg>

        <div
          className={classNames(
            "absolute left-0 top-0 h-16 w-48 translate-x-[--x] translate-y-[--y] rounded-lg bg-slate-500 px-8 text-white shadow-lg transition-opacity",
            tooltipData ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="mask-legend h-16 overflow-hidden scroll-smooth py-8">
            {tooltipData &&
              tooltipData.map((dataPoint) => (
                <div
                  className={classNames(
                    "flex scroll-my-5 items-center gap-2",
                    `legend-item-${dataPoint.name}`
                  )}
                  key={dataPoint.name}
                >
                  <span
                    className="inline-block h-4 w-4"
                    style={{ backgroundColor: dataPoint.color }}
                  />
                  {dataPoint.name}: {dataPoint.value}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
