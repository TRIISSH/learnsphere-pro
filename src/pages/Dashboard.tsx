import { BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import CourseCard from "@/components/CourseCard";
import { courses, weeklyActivity } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const activeCourses = courses.filter((c) => c.progress < 100);
  const avgScore = Math.round(courses.reduce((sum, c) => sum + c.score, 0) / courses.length);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">
          Welcome back, <span className="text-gradient">Alex</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your learning overview</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Active Courses" value={String(activeCourses.length)} variant="primary" />
        <StatCard icon={Trophy} label="Avg. Score" value={`${avgScore}%`} subtext="+5% this month" variant="success" />
        <StatCard icon={Clock} label="Study Time" value="18.5h" subtext="This week" variant="accent" />
        <StatCard icon={TrendingUp} label="Streak" value="12 days" subtext="Personal best!" />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading font-semibold text-lg">Continue Learning</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {activeCourses.slice(0, 4).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg">Weekly Activity</h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}h`, "Study Time"]}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
