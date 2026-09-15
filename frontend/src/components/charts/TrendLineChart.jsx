import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS, CHART_INK, tooltipStyle } from '../../utils/chartTheme';

const axisTick = { fill: CHART_INK.muted, fontSize: 11.5 };

const TrendLineChart = ({ data, xKey, yKey, height = 260, color = CHART_COLORS.brand }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
      <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: CHART_INK.axis }} tickLine={false} />
      <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
      <Tooltip {...tooltipStyle} />
      <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.25} fill="url(#trendFill)" dot={{ r: 3, strokeWidth: 0, fill: color }} activeDot={{ r: 5 }} />
    </AreaChart>
  </ResponsiveContainer>
);

export default TrendLineChart;
