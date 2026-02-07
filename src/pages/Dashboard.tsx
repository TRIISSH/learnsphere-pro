import { BookOpen, Trophy, Target, Flame, TrendingUp, DollarSign } from "lucide-react";
import StatCard from "@/components/StatCard";
import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { displayName } = useAuth();
  const { data: courses, isLoading } = useCourses();

  const activeCourses = courses?.filter((c) => c.progress < 100 && !c.locked) || [];
  const completedCourses = courses?.filter((c) => c.progress === 100) || [];
  const totalChapters = courses?.reduce((s, c) => s + c.totalChapters, 0) || 0;
  const completedChapters = courses?.reduce((s, c) => s + c.completedCount, 0) || 0;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const firstName = displayName?.split(" ")[0] || "Investor";

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

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 finance-grid min-h-screen">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-5 w-5 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Financial Dashboard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">
          Welcome back, <span className="text-gradient">{firstName}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Your wealth-building journey at a glance</p>
      </motion.header>

      {/* Ticker line */}
      <div className="ticker-line w-full rounded-full" />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Active Courses" value={String(activeCourses.length)} variant="primary" />
        <StatCard icon={Trophy} label="Completed" value={String(completedCourses.length)} subtext={`of ${courses?.length || 0} courses`} variant="success" />
        <StatCard icon={Target} label="Overall Progress" value={`${overallProgress}%`} subtext={`${completedChapters}/${totalChapters} chapters`} variant="accent" />
        <StatCard icon={Flame} label="Chapters Done" value={String(completedChapters)} />
      </section>

      {activeCourses.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Continue Learning
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCourses.slice(0, 6).map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </section>
      )}

      {completedCourses.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" /> Completed Courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
