import { motion } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";

const PIE_COLORS = ["#333333", "#706C61", "#A6A399", "#E1F4F3", "#999999", "#B0CCC9"];

/* ── Shared empty fallback ── */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="w-14 h-14 rounded-2xl bg-[#E1F4F3]/50 border border-[#E1F4F3] flex items-center justify-center shadow-inner">
      <Icon className="w-7 h-7 text-[#706C61]" />
    </div>
    <div className="text-center">
      <p className="text-[#333333] font-bold text-sm tracking-tight">{title}</p>
      <p className="text-[#706C61] text-xs mt-1.5 font-medium">{subtitle}</p>
    </div>
  </div>
);

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-[#E1F4F3] shadow-2xl rounded-xl p-3.5 min-w-[120px]">
      <p className="text-xs font-bold text-[#333333] mb-2 pb-2 border-b border-[#E1F4F3]/60">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mt-2">
          <span className="text-xs font-medium text-[#706C61]">{entry.name}</span>
          <span className="text-sm font-extrabold text-[#333333]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ConsistencyChart = () => {
  const { stats, gettingStatsForGraph } = useTask();

  if (gettingStatsForGraph) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-[#333333] animate-spin" />
        <p className="text-sm font-medium text-[#706C61]">Loading stats…</p>
      </div>
    );
  }

  const data = stats?.consistencyGraph || [];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {data.length > 0 ? (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#333333" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#E1F4F3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1F4F3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} 
                axisLine={{ stroke: "#E1F4F3" }} 
                tickLine={false} 
                tickMargin={12}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} 
                axisLine={false} 
                tickLine={false} 
                allowDecimals={false} 
                tickMargin={12}
              />
              <ReTooltip content={<CustomTooltip />} cursor={{ stroke: '#E1F4F3', strokeWidth: 2, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="totalCompleted" 
                name="Completed" 
                stroke="#333333" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                strokeWidth={3} 
                activeDot={{ r: 6, fill: "#333333", stroke: "#FFFFFF", strokeWidth: 2, shadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={BarChart3} title="No consistency data yet" subtitle="Complete a routine to see your stats!" />
      )}
    </motion.div>
  );
};

export const BreakdownChart = () => {
  const { stats, gettingStatsForGraph } = useTask();

  if (gettingStatsForGraph) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-[#333333] animate-spin" />
        <p className="text-sm font-medium text-[#706C61]">Loading stats…</p>
      </div>
    );
  }

  const data = stats?.breakdownGraph || [];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
      {data.length > 0 ? (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="completionCount"
                nameKey="routineName"
                cx="50%" cy="45%"
                outerRadius={100} innerRadius={60}
                paddingAngle={4}
                label={false}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={PIE_COLORS[index % PIE_COLORS.length]} 
                    stroke="#FFFFFF" 
                    strokeWidth={3}
                    style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.05))" }}
                  />
                ))}
              </Pie>
              <ReTooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle" 
                iconSize={8} 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ fontSize: "12px", fontWeight: 500, color: "#706C61", paddingTop: "20px" }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={PieChartIcon} title="No breakdown data yet" subtitle="Complete a routine to see your stats!" />
      )}
    </motion.div>
  );
};

const StatGraph = () => (
  <div className="space-y-8">
    <ConsistencyChart />
    <BreakdownChart />
  </div>
);

export default StatGraph;