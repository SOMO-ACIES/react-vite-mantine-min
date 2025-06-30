import React from 'react';
import { IconMinus, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

interface TelemetryTrendLineProps {
  data: number[];
  color: string;
  trend: 'up' | 'down' | 'stable';
  height?: number;
  width?: number;
}

const TelemetryTrendLine: React.FC<TelemetryTrendLineProps> = ({
  data,
  color,
  trend,
  height = 40,
  width = 80,
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Generate SVG path for the trend line
  const pathData = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp size={12} color={color} />;
      case 'down':
        return <IconTrendingDown size={12} color={color} />;
      default:
        return <IconMinus size={12} color={color} />;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Fill area under the curve */}
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#gradient-${color})`}
          stroke="none"
        />

        {/* Trend line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle key={index} cx={x} cy={y} r="2" fill={color} stroke="white" strokeWidth="1" />
          );
        })}
      </svg>
      {getTrendIcon()}
    </div>
  );
};

export default TelemetryTrendLine;
