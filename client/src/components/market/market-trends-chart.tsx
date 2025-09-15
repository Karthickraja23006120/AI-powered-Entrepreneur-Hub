import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', growth: 12, interest: 85 },
  { month: 'Feb', growth: 15, interest: 88 },
  { month: 'Mar', growth: 18, interest: 92 },
  { month: 'Apr', growth: 23, interest: 95 },
  { month: 'May', growth: 28, interest: 98 },
  { month: 'Jun', growth: 31, interest: 102 },
  { month: 'Jul', growth: 27, interest: 99 },
  { month: 'Aug', growth: 33, interest: 105 },
  { month: 'Sep', growth: 38, interest: 108 },
  { month: 'Oct', growth: 42, interest: 112 },
  { month: 'Nov', growth: 45, interest: 115 },
  { month: 'Dec', growth: 48, interest: 118 },
];

export default function MarketTrendsChart() {
  return (
    <div className="chart-container" data-testid="market-trends-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs text-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-xs text-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-chart-1">
                      Growth: {payload[0].value}%
                    </p>
                    <p className="text-sm text-chart-2">
                      Interest: {payload[1].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="growth"
            stackId="1"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="2"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
