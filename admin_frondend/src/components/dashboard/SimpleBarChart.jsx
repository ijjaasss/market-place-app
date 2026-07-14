
const SimpleBarChart = ({ data, labelKey, valueKey, color = "#C9A15C" }) => {
  const width = 560;
  const height = 180;
  const paddingBottom = 24;
  const barGap = 6;
  const maxValue = Math.max(...data.map((d) => d[valueKey]), 1);
  const barWidth = width / data.length - barGap;

  return (
    <svg
      viewBox={`0 0 ${width} ${height + paddingBottom}`}
      className="w-full h-auto"
      role="img"
      aria-label="Bar chart"
    >
      {/* baseline */}
      <line
        x1="0"
        y1={height}
        x2={width}
        y2={height}
        stroke="#2A3142"
        strokeWidth="1"
      />

      {data.map((d, i) => {
        const value = d[valueKey];
        const barHeight = maxValue > 0 ? (value / maxValue) * (height - 12) : 0;
        const x = i * (barWidth + barGap);
        const y = height - barHeight;

        return (
          <g key={d[labelKey]}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="2"
              fill={color}
              opacity={value === 0 ? 0.15 : 0.85}
            >
              <title>{`${d[labelKey]}: ${value}`}</title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={height + 16}
              textAnchor="middle"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              fill="#565F78"
            >
              {d[labelKey]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default SimpleBarChart;