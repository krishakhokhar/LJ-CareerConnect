import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS, CHART_INK, tooltipStyle } from '../../utils/chartTheme';

const axisTick = { fill: CHART_INK.muted, fontSize: 11.5 };

/**
 * Single or dual-series bar chart. `series` = [{ key, label, color }].
 * For a single series, category identity comes from the x-axis labels
 * (not color), so it defaults to one brand hue.
 */
const SimpleBarChart = ({ data, xKey, series, horizontal = false, height = 260 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
      <CartesianGrid stroke={CHART_INK.grid} vertical={horizontal} horizontal={!horizontal} strokeDasharray="0" />
      {horizontal ? (
        <>
          <XAxis type="number" tick={axisTick} axisLine={{ stroke: CHART_INK.axis }} tickLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey={xKey} tick={axisTick} axisLine={{ stroke: CHART_INK.axis }} tickLine={false} width={110} />
        </>
      ) : (
        <>
          <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: CHART_INK.axis }} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
        </>
      )}
      <Tooltip {...tooltipStyle} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary }} iconType="circle" iconSize={8} />}
      {series.map((s) => (
        <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color || CHART_COLORS.brand} radius={[6, 6, 6, 6]} maxBarSize={34} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export default SimpleBarChart;
