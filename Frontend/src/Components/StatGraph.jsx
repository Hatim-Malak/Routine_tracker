import React from "react";
import { motion } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line,
  RadialBarChart, RadialBar
} from "recharts";
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  CalendarDays, 
  Target, 
  Clock, 
  Trophy 
} from "lucide-react";
import ChartErrorBoundary from "./ChartErrorBoundary";

const PIE_COLORS = ["#333333", "#706C61", "#A6A399", "#E1F4F3", "#999999", "#B0CCC9"];
const PRIMARY_CHARCOAL = "#323643"; // Deep charcoal

/* ── Shared empty fallback ── */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-8 gap-3 h-full">
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
    <div className="bg-white/90 backdrop-blur-md border border-[#E1F4F3] shadow-2xl rounded-xl p-3.5 min-w-[120px] z-50">
      {label && <p className="text-xs font-bold text-[#333333] mb-2 pb-2 border-b border-[#E1F4F3]/60">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mt-2">
          <span className="text-xs font-medium text-[#706C61]">{entry.name || "Value"}</span>
          <span className="text-sm font-extrabold text-[#333333]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Helper Wrappers ── */
const ChartSkeleton = () => (
  <div className="w-full h-full min-h-[220px] rounded-3xl border border-[#E1F4F3] bg-[#FAFAFA] p-6 animate-pulse">
    <div className="h-4 w-28 rounded-full bg-[#E1F4F3] mb-5" />
    <div className="h-[calc(100%-2.5rem)] rounded-[1.5rem] bg-[#E1F4F3]/80" />
  </div>
);

const ChartContainer = ({ children, title, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 16 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.4, delay }}
    className="flex flex-col w-full h-full min-w-0 min-h-0" 
  >
    <h3 className="text-sm font-bold text-[#323643] mb-4 uppercase tracking-widest">{title}</h3>
    <div className="flex-1 w-full min-h-[220px] relative">
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  </motion.div>
);

/* ── 1. Consistency Chart (Area) ── */
export const ConsistencyChart = () => {
  const { stats, gettingStatsForGraph } = useTask();
  const data = stats?.consistencyGraph || [];

  return (
    <ChartContainer title="Consistency" delay={0}>
      {gettingStatsForGraph ? (
        <ChartSkeleton />
      ) : data.length > 0 ? (
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY_CHARCOAL} stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#E1F4F3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1F4F3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} axisLine={{ stroke: "#E1F4F3" }} tickLine={false} tickMargin={12} />
              <YAxis tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} tickMargin={12} />
              <ReTooltip content={<CustomTooltip />} cursor={{ stroke: '#E1F4F3', strokeWidth: 2, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="totalCompleted" name="Completed" stroke={PRIMARY_CHARCOAL} fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} activeDot={{ r: 6, fill: PRIMARY_CHARCOAL, stroke: "#FFFFFF", strokeWidth: 2, shadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      ) : (
        <EmptyState icon={BarChart3} title="No consistency data yet" subtitle="Complete a routine to see your stats!" />
      )}
    </ChartContainer>
  );
};

/* ── 2. Breakdown Chart (Pie) ── */
export const BreakdownChart = () => {
  const { stats, gettingStatsForGraph } = useTask();
  const data = stats?.breakdownGraph || [];

  return (
    <ChartContainer title="Task Breakdown" delay={0.1}>
      {gettingStatsForGraph ? (
        <ChartSkeleton />
      ) : data.length > 0 ? (
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <PieChart>
              <Pie data={data} dataKey="completionCount" nameKey="routineName" cx="50%" cy="45%" outerRadius="80%" innerRadius="50%" paddingAngle={4} label={false}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#FFFFFF" strokeWidth={3} style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.05))" }} />
                ))}
              </Pie>
              <ReTooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "12px", fontWeight: 500, color: "#706C61", paddingTop: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      ) : (
        <EmptyState icon={PieChartIcon} title="No breakdown data yet" subtitle="Complete a routine to see your stats!" />
      )}
    </ChartContainer>
  );
};

/* ── 3. Weekly Activity Chart (Bar) ── */
export const WeeklyActivityChart = () => {
  const { stats, gettingStatsForGraph } = useTask();
  const data = stats?.weeklyGraph || [];

  return (
    <ChartContainer title="Weekly Activity" delay={0.2}>
      {gettingStatsForGraph ? (
        <ChartSkeleton />
      ) : data.length > 0 ? (
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1F4F3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} axisLine={{ stroke: "#E1F4F3" }} tickLine={false} tickMargin={12} />
              <YAxis tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} tickMargin={12} />
              <ReTooltip content={<CustomTooltip />} cursor={{ fill: '#E1F4F3', opacity: 0.4 }} />
              <Bar dataKey="count" name="Tasks Completed" fill={PRIMARY_CHARCOAL} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      ) : (
        <EmptyState icon={CalendarDays} title="No weekly data yet" subtitle="Your weekly activity will appear here." />
      )}
    </ChartContainer>
  );
};

/* ── 4. Routine Balance Chart (Radar) ── */
export const RoutineBalanceChart = () => {
  const { stats, gettingStatsForGraph } = useTask();
  const data = stats?.balanceGraph || [];

  return (
    <ChartContainer title="Category Balance" delay={0.3}>
      {gettingStatsForGraph ? (
        <ChartSkeleton />
      ) : data.length > 0 ? (
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#E1F4F3" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#706C61', fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
              <Radar name="Balance Score" dataKey="score" stroke={PRIMARY_CHARCOAL} fill={PRIMARY_CHARCOAL} fillOpacity={0.4} />
              <ReTooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      ) : (
        <EmptyState icon={Target} title="No balance data yet" subtitle="Complete tasks across different categories!" />
      )}
    </ChartContainer>
  );
};

/* ── 5. Time of Day Productivity (Line) ── */
export const TimeOfDayChart = () => {
  const { stats, gettingStatsForGraph } = useTask();
  const data = stats?.timeOfDayGraph || [];

  return (
    <ChartContainer title="Peak Focus Hours" delay={0.4}>
      {gettingStatsForGraph ? (
        <ChartSkeleton />
      ) : data.length > 0 ? (
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1F4F3" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} axisLine={{ stroke: "#E1F4F3" }} tickLine={false} tickMargin={12} />
              <YAxis tick={{ fontSize: 11, fill: "#706C61", fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} tickMargin={12} />
              <ReTooltip content={<CustomTooltip />} cursor={{ stroke: '#E1F4F3', strokeWidth: 2 }} />
              <Line type="smooth" dataKey="completed" name="Tasks Completed" stroke={PRIMARY_CHARCOAL} strokeWidth={3} dot={{ r: 4, fill: "#FFFFFF", stroke: PRIMARY_CHARCOAL, strokeWidth: 2 }} activeDot={{ r: 6, fill: PRIMARY_CHARCOAL, stroke: "#FFFFFF", strokeWidth: 2, shadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      ) : (
        <EmptyState icon={Clock} title="No time data yet" subtitle="Complete tasks to see your peak hours!" />
      )}
    </ChartContainer>
  );
};

/* ── 6. Goal Progress (Radial Bar) ── */
export const GoalProgressChart = () => {
  const { stats, gettingStatsForGraph } = useTask();
  const data = stats?.goalProgressGraph || [];
  const progressValue = data.length > 0 ? data[0].value : 0;

  return (
    <ChartContainer title="Weekly Goal Progress" delay={0.5}>
      {gettingStatsForGraph ? (
        <ChartSkeleton />
      ) : data.length > 0 ? (
        <ChartErrorBoundary>
          <div className="w-full h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" barSize={20} data={[{ name: "Progress", value: progressValue }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: '#E1F4F3' }} dataKey="value" cornerRadius={10} fill={PRIMARY_CHARCOAL} />
                <ReTooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-[#333333]">{progressValue}%</span>
              <span className="text-xs font-semibold text-[#706C61] uppercase tracking-widest mt-1">Goal Reached</span>
            </div>
          </div>
        </ChartErrorBoundary>
      ) : (
        <EmptyState icon={Trophy} title="No goals set" subtitle="Set a target to track your progress." />
      )}
    </ChartContainer>
  );
};

/* ── Main Export ── */
const StatGraph = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
    <ConsistencyChart />
    <BreakdownChart />
    <WeeklyActivityChart />
    <RoutineBalanceChart />
    <TimeOfDayChart />
    <GoalProgressChart />
  </div>
);

export default StatGraph;
