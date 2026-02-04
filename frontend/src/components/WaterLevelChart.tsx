import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface WaterLevelChartProps {
  data: { time: string; level: number }[];
  threshold: number; // For reference line logic if needed (visualized via color)
}

export function WaterLevelChart({ data, threshold }: WaterLevelChartProps) {
  const isDanger = data[data.length - 1].level > 90;
  const color = isDanger ? '#ef4444' : '#3b82f6'; // Red or Blue

  return (
    <div className="h-[120px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
          <XAxis 
             dataKey="time" 
             axisLine={false} 
             tickLine={false} 
             tick={{ fontSize: 10, fill: '#64748b' }} 
             interval="preserveStartEnd"
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 'bold' }}
            formatter={(value: number) => [`${value}%`, 'Level']}
          />
          <Area 
            type="monotone" 
            dataKey="level" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorLevel)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
