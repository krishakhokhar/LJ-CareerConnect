import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORICAL, CHART_INK, tooltipStyle } from '../../utils/chartTheme';

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const DonutChart = ({ data, nameKey, valueKey, height = 260, colors = CATEGORICAL }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        dataKey={valueKey}
        nameKey={nameKey}
        innerRadius="58%"
        outerRadius="88%"
        paddingAngle={2}
        stroke={CHART_INK.surface}
        strokeWidth={2}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip {...tooltipStyle} />
      <Legend content={renderLegend} />
    </PieChart>
  </ResponsiveContainer>
);

export default DonutChart;
