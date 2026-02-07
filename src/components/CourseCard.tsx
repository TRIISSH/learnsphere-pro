import { Course } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const difficultyColors = {
  beginner: "bg-success/15 text-success border-success/30",
  intermediate: "bg-info/15 text-info border-info/30",
  advanced: "bg-accent/15 text-accent border-accent/30",
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{course.icon}</span>
          <div>
            <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground">{course.subject}</p>
          </div>
        </div>
        {course.recommended && (
          <Star className="h-4 w-4 text-accent fill-accent" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className={`text-[10px] px-2 py-0 ${difficultyColors[course.difficulty]}`}>
          {course.difficulty}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {course.completedLessons}/{course.totalLessons} lessons
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Avg. Score</span>
        <span className="text-sm font-heading font-bold text-primary">{course.score}%</span>
      </div>
    </div>
  );
}
