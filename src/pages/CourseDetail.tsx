import { useParams, useNavigate } from "react-router-dom";
import { useCourses, useToggleChapter } from "@/hooks/useCourses";
import { ArrowLeft, Check, Lock, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

const difficultyColors = {
  beginner: "bg-success/15 text-success border-success/30",
  intermediate: "bg-info/15 text-info border-info/30",
  advanced: "bg-accent/15 text-accent border-accent/30",
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();
  const toggleChapter = useToggleChapter();

  const course = courses?.find((c) => c.id === id);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-3 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Course not found.</p>
        <Button variant="link" onClick={() => navigate("/courses")}>Back to courses</Button>
      </div>
    );
  }

  if (course.locked) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="font-heading text-2xl font-bold">{course.title} is Locked</h1>
        <p className="text-muted-foreground">
          Complete all {course.difficulty === "advanced" ? "intermediate" : "beginner"} level courses first to unlock this course.
        </p>
        <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  const handleToggle = (chapterId: string, completed: boolean) => {
    toggleChapter.mutate(
      { chapterId, completed },
      {
        onSuccess: () => {
          toast.success(completed ? "Chapter unmarked" : "Chapter completed! 🎉");
        },
        onError: () => toast.error("Failed to update chapter"),
      }
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </button>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <span className="text-4xl">{course.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-heading font-bold">{course.title}</h1>
            <Badge variant="outline" className={`${difficultyColors[course.difficulty]} capitalize`}>
              {course.difficulty}
            </Badge>
          </div>
          <p className="text-muted-foreground">{course.subject}</p>
        </div>
      </motion.header>

      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{course.completedCount}/{course.totalChapters} chapters completed</span>
          </div>
          {course.progress === 100 && (
            <div className="flex items-center gap-1 text-success text-sm font-semibold">
              <Trophy className="h-4 w-4" /> Course Complete!
            </div>
          )}
        </div>
        <Progress value={course.progress} className="h-3" />
        <p className="text-xs text-muted-foreground text-right">{course.progress}%</p>
      </div>

      <div className="space-y-3">
        {course.chapters
          .sort((a, b) => a.chapter_order - b.chapter_order)
          .map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group flex items-center gap-4 rounded-xl border p-4 transition-all cursor-pointer
                ${chapter.completed
                  ? "bg-success/5 border-success/20 hover:border-success/40"
                  : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                }`}
              onClick={() => handleToggle(chapter.id, chapter.completed)}
            >
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${chapter.completed
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
              >
                {chapter.completed ? <Check className="h-5 w-5" /> : chapter.chapter_order}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${chapter.completed ? "line-through text-muted-foreground" : ""}`}>
                  {chapter.title}
                </p>
              </div>
              <Button
                variant={chapter.completed ? "outline" : "default"}
                size="sm"
                className="flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(chapter.id, chapter.completed);
                }}
                disabled={toggleChapter.isPending}
              >
                {chapter.completed ? "Undo" : "Complete"}
              </Button>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
