import { useNavigate } from "react-router-dom";
import { CourseWithProgress } from "@/hooks/useCourses";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, Trophy, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const difficultyColors = {
  beginner: "bg-success/15 text-success border-success/30",
  intermediate: "bg-info/15 text-info border-info/30",
  advanced: "bg-accent/15 text-accent border-accent/30",
};

export default function CourseCard({ course, index = 0 }: { course: CourseWithProgress; index?: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`group relative rounded-2xl border bg-card p-5 transition-all duration-300 cursor-pointer
        ${course.locked
          ? "opacity-60 border-border cursor-not-allowed"
          : "border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
        }`}
      onClick={() => !course.locked && navigate(`/courses/${course.id}`)}
    >
      {course.locked && (
        <div className="absolute inset-0 rounded-2xl bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">
              Complete {course.difficulty === "advanced" ? "intermediate" : "beginner"} courses first
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{course.icon}</span>
          <div>
            <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground">{course.subject}</p>
          </div>
        </div>
        {course.progress === 100 ? (
          <Trophy className="h-5 w-5 text-accent fill-accent" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>
    </motion.div>
  );
}
