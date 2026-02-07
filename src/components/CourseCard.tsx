import { useNavigate } from "react-router-dom";
import { CourseWithProgress } from "@/hooks/useCourses";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, Trophy, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const difficultyColors = {
  beginner: "bg-primary/15 text-primary border-primary/30",
  intermediate: "bg-accent/15 text-accent border-accent/30",
  advanced: "bg-info/15 text-info border-info/30",
};

const difficultyGlow = {
  beginner: "hover:shadow-primary/10",
  intermediate: "hover:shadow-accent/10",
  advanced: "hover:shadow-info/10",
};

export default function CourseCard({ course, index = 0 }: { course: CourseWithProgress; index?: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className={`group relative rounded-2xl border bg-card p-5 transition-all duration-300 cursor-pointer overflow-hidden
        ${course.locked
          ? "opacity-50 border-border cursor-not-allowed"
          : `border-border hover:border-accent/30 hover:shadow-xl ${difficultyGlow[course.difficulty]} hover:-translate-y-1`
        }`}
      onClick={() => !course.locked && navigate(`/courses/${course.id}`)}
    >
      {/* Shimmer effect on hover */}
      {!course.locked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 gold-shimmer pointer-events-none" />
      )}

      {course.locked && (
        <div className="absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">
              Complete {course.difficulty === "advanced" ? "intermediate" : "beginner"} courses first
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{course.icon}</span>
          <div>
            <h3 className="font-heading font-semibold text-sm group-hover:text-accent transition-colors">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground">{course.subject}</p>
          </div>
        </div>
        {course.progress === 100 ? (
          <Trophy className="h-5 w-5 text-accent fill-accent" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className={`text-[10px] px-2 py-0 ${difficultyColors[course.difficulty]}`}>
          {course.difficulty}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {course.completedCount}/{course.totalChapters} chapters
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Progress
          </span>
          <span className="font-medium font-heading text-accent">{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>
    </motion.div>
  );
}
