import { motion } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";

const PIE_COLORS = ["#333333", "#706C61", "#E1F4F3", "#555555", "#999999", "#B0CCC9"];

/* ── Shared empty fallback ── */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="w-14 h-14 rounded-2xl bg-[#E1F4F3] flex items-center justify-center">
      <Icon className="w-7 h-7 text-[#706C61]" />
    </div>
    <div className="text-center">
      <p className="text-[#333333] font-semibold text-sm">{title}</p>
      <p className="text-[#706C61] text-xs mt-1">{subtitle}</p>
    </div>
  </div>
);

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#E1F4F3] px-3 py-2">
      <p className="text-xs font-medium text-[#333333]">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-[#706C61]">
          {entry.name}: <span className="font-semibold text-[#333333]">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   Consistency Bar Chart — named export
   ════════════════════════════════════════ */
export const ConsistencyChart = () => {
  const { stats, gettingStatsForGraph } = useTask();

  if (gettingStatsForGraph) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-[#333333] animate-spin" />
        <p className="text-sm text-[#706C61]">Loading stats…</p>
      </div>
    );
  }

  const data = stats?.consistencyGraph || [];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h3 className="text-sm font-semibold text-[#333333] mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Consistency Graph
      </h3>
      {data.length > 0 ? (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1F4F3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#706C61" }} axisLine={{ stroke: "#E1F4F3" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#706C61" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <ReTooltip content={<CustomTooltip />} />
              <Bar dataKey="totalCompleted" name="Completed" fill="#333333" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={BarChart3} title="No consistency data yet" subtitle="Complete a routine to see your stats!" />
      )}
    </motion.div>
  );
};

/* ════════════════════════════════════════
   Breakdown Pie Chart — named export
   ════════════════════════════════════════ */
export const BreakdownChart = () => {
  const { stats, gettingStatsForGraph } = useTask();

  if (gettingStatsForGraph) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-[#333333] animate-spin" />
        <p className="text-sm text-[#706C61]">Loading stats…</p>
      </div>
    );
  }

  const data = stats?.breakdownGraph || [];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
      <h3 className="text-sm font-semibold text-[#333333] mb-4 flex items-center gap-2">
        <PieChartIcon className="w-4 h-4" />
        Routine Breakdown
      </h3>
      {data.length > 0 ? (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="completionCount"
                nameKey="routineName"
                cx="50%" cy="50%"
                outerRadius={90} innerRadius={45}
                paddingAngle={3} strokeWidth={2} stroke="#FFFFFF"
                label={({ routineName, percent }) => `${routineName} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: "#706C61", strokeWidth: 1 }}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#706C61" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={PieChartIcon} title="No breakdown data yet" subtitle="Complete a routine to see your stats!" />
      )}
    </motion.div>
  );
};

/* ── Default export: both combined (backward compat) ── */
const StatGraph = () => (
  <div className="space-y-8">
    <ConsistencyChart />
    <BreakdownChart />
  </div>
);

export default StatGraph;