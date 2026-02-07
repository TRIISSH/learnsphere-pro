import { useCourses } from "@/hooks/useCourses";
import CourseCard from "@/components/CourseCard";
import { Lightbulb, ArrowRight, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Recommendations() {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const lowProgress = courses?.filter((c) => c.progress < 50 && !c.locked).sort((a, b) => a.progress - b.progress) || [];
  const inProgress = courses?.filter((c) => c.progress >= 50 && c.progress < 100) || [];
  const locked = courses?.filter((c) => c.locked) || [];

  const tips = [
    { title: "Focus on weak areas", desc: lowProgress.length > 0 ? `"${lowProgress[0]?.title}" needs your attention — you're at ${lowProgress[0]?.progress}%.` : "You're doing great across all courses!", icon: Zap },
    { title: "Unlock next level", desc: locked.length > 0 ? `Complete current level courses to unlock ${locked.length} more course${locked.length > 1 ? "s" : ""}.` : "All courses are unlocked! 🎉", icon: BookOpen },
    { title: "Stay consistent", desc: "Try completing at least 1 chapter per day for steady progress and better retention.", icon: Lightbulb },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Personalized For You</h1>
        <p className="text-muted-foreground mt-1">Recommendations based on your learning patterns</p>
      </motion.header>

      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" /> Smart Tips
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-accent/20 bg-accent/5 p-5 space-y-2"
            >
              <div className="flex items-center gap-2">
                <tip.icon className="h-4 w-4 text-accent" />
                <h3 className="font-heading font-semibold text-sm">{tip.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {lowProgress.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading font-semibold text-lg">Needs Attention</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowProgress.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </section>
      )}

      {inProgress.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading font-semibold text-lg">Almost There</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
