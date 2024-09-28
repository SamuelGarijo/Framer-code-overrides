import { BarSection } from "./chart-data-points";

export const barWidth = 24;
export const barSpacing = 38;
export const chartSpacing = 40;
export const tooltipOffset = 30;

export const getX = (barIndex: number) =>
  barIndex * (barWidth + barSpacing) + chartSpacing;

/**
 * This small helper function calculates the position of a bar section
 * in such a way that they are all stacked on top of each other.
 *
 * When using chart libraries, this is usually done automatically.
 * Also the 400 pixels is the height of the chart, something you'd want to make
 * dynamic in real world use cases. But we're not building a chart library here :).
 */
export const getY = (
  value: number,
  currentIndex: number,
  barSections: BarSection[]
) =>
  400 -
  value -
  barSections.slice(0, currentIndex).reduce((acc, curr) => acc + curr.value, 0);
