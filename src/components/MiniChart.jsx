import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

function Candlestick({ x, y, width, height, payload }) {
  if (!payload) return null;
  const { open, high, low, close } = payload;
  const isUp = close >= open;
  const color = isUp ? '#22c55e' : '#ef4444';

  // Body: open to close
  const bodyTop = y + (height - (close - open) / (high - low) * height);
  const bodyBottom = y + height;
  const bodyHeight = Math.abs((close - open) / (high - low) * height) || 2;

  // Wick extremes
  const wickTop = y;
  const wickBottom = y + height;

  // Center x of the candle
  const cx = x + width / 2;

  return (
    <g>
      {/* High-Low wick */}
      <line
        x1={cx} y1={wickTop}
        x2={cx} y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      {/* Open-Close body */}
      <rect
        x={x + 1}
        y={bodyTop}
        width={Math.max(width - 2, 4)}
        height={Math.max(bodyHeight, 2)}
        fill={isUp ? color : color}
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
}

export default function MiniChart({ prices, isUp }) {
  const data = prices.map(p => ({
    date: p.dateShort,
    open: p.open,
    high: p.high,
    low: p.low,
    close: p.close,
    volume: p.volumeM,
    isUp: p.close >= p.open,
  }));

  // Y-axis domain: show low-high range with padding
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={v => v.toFixed(0)}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value, name) => {
              const labels = { open: '開', high: '高', low: '低', close: '收' };
              return [`${value.toFixed(2)}`, labels[name] || name];
            }}
          />
          <Bar
            dataKey="close"
            shape={<Candlestick />}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
