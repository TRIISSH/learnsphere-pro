import { useCourses } from "@/hooks/useCourses";
import { TrendingUp, Target, BookOpen, Trophy, PieChart } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalChapters = courses?.reduce((s, c) => s + c.totalChapters, 0) || 0;
  const completedChapters = courses?.reduce((s, c) => s + c.completedCount, 0) || 0;
  const completedCourses = courses?.filter((c) => c.progress === 100).length || 0;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const byDifficulty = ["beginner", "intermediate", "advanced"].map((d) => {
    const dCourses = courses?.filter((c) => c.difficulty === d) || [];
    const total = dCourses.reduce((s, c) => s + c.totalChapters, 0);
    const done = dCourses.reduce((s, c) => s + c.completedCount, 0);
    return { difficulty: d, total, done, progress: total > 0 ? Math.round((done / total) * 100) : 0, count: dCourses.length };
  });

  const subjectMap = new Map<string, { total: number; done: number }>();
  courses?.forEach((c) => {
    const existing = subjectMap.get(c.subject) || { total: 0, done: 0 };
    subjectMap.set(c.subject, { total: existing.total + c.totalChapters, done: existing.done + c.completedCount });
  });

  const diffColors = { beginner: "text-primary", intermediate: "text-accent", advanced: "text-info" };
  const diffBg = { beginner: "bg-primary", intermediate: "bg-accent", advanced: "bg-info" };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 finance-grid min-h-screen">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <PieChart className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Portfolio Analytics</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your financial learning portfolio</p>
      </motion.header>

      <div className="ticker-line w-full rounded-full" />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Overall Progress" value={`${overallProgress}%`} variant="primary" />
        <StatCard icon={Target} label="Chapters Done" value={`${completedChapters}/${totalChapters}`} variant="accent" />
        <StatCard icon={Trophy} label="Courses Complete" value={String(completedCourses)} subtext={`of ${courses?.length || 0}`} variant="success" />
        <StatCard icon={BookOpen} label="Active Courses" value={String((courses?.length || 0) - completedCourses)} />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full" />
          <h2 className="font-heading font-semibold text-lg">Progress by Level</h2>
          {byDifficulty.map((d) => (
            <div key={d.difficulty} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium capitalize ${diffColors[d.difficulty as keyof typeof diffColors]}`}>
                  {d.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">{d.done}/{d.total} chapters</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${diffBg[d.difficulty as keyof typeof diffBg]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${d.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
          <h2 className="font-heading font-semibold text-lg">Progress by Subject</h2>
          {Array.from(subjectMap.entries()).map(([subject, data]) => {
            const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
            return (
              <div key={subject} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{subject}</span>
                  <span className="text-accent font-heading font-semibold">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/3 rounded-bl-full" />
        <h2 className="font-heading font-semibold text-lg mb-4">Course Breakdown</h2>
        <div className="space-y-3">
          {courses?.map((c) => (
            <div key={c.id} className="flex items-center gap-4">
              <span className="text-xl">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{c.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">{c.completedCount}/{c.totalChapters}</span>
                </div>
                <Progress value={c.progress} className="h-1.5" />
              </div>
              <span className="text-sm font-heading font-bold text-accent w-12 text-right">{c.progress}%</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
