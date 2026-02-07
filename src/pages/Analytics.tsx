import { performanceHistory, subjectBreakdown, courses } from "@/lib/data";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, Target, Clock, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function Analytics() {
  const avgScore = Math.round(courses.reduce((s, c) => s + c.score, 0) / courses.length);
  const totalHours = performanceHistory.reduce((s, p) => s + p.timeSpent, 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your learning patterns</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Score Trend" value="+25%" subtext="Over 10 months" variant="success" />
        <StatCard icon={Target} label="Current Avg" value={`${avgScore}%`} variant="primary" />
        <StatCard icon={Clock} label="Total Hours" value={`${totalHours}h`} variant="accent" />
        <StatCard icon={Zap} label="Completion" value="68%" subtext="Across all courses" />
      </section>

      <section className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-heading font-semibold">Score Progression</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceHistory}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="timeSpent"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> Score
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" /> Study Hours
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-heading font-semibold">Subject Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={subjectBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={0}
              >
                {subjectBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Time Spent"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {subjectBreakdown.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.fill }} />
                  {s.name}
                </span>
                <span className="font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
