import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CourseWithProgress {
  id: string;
  title: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  chapters: { id: string; title: string; chapter_order: number; completed: boolean }[];
  completedCount: number;
  totalChapters: number;
  progress: number;
  locked: boolean;
}

export function useCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["courses", user?.id],
    queryFn: async (): Promise<CourseWithProgress[]> => {
      const { data: courses, error: cErr } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order");
      if (cErr) throw cErr;

      const { data: chapters, error: chErr } = await supabase
        .from("chapters")
        .select("*")
        .order("chapter_order");
      if (chErr) throw chErr;

      let completions: string[] = [];
      if (user) {
        const { data: comp } = await supabase
          .from("user_chapter_completions")
          .select("chapter_id")
          .eq("user_id", user.id);
        completions = (comp || []).map((c) => c.chapter_id);
      }

      const coursesWithChapters = (courses || []).map((course) => {
        const courseChapters = (chapters || [])
          .filter((ch) => ch.course_id === course.id)
          .map((ch) => ({
            ...ch,
            completed: completions.includes(ch.id),
          }));
        const completedCount = courseChapters.filter((ch) => ch.completed).length;
        return {
          id: course.id,
          title: course.title,
          subject: course.subject,
          difficulty: course.difficulty as "beginner" | "intermediate" | "advanced",
          icon: course.icon || "📚",
          chapters: courseChapters,
          completedCount,
          totalChapters: courseChapters.length,
          progress: courseChapters.length > 0 ? Math.round((completedCount / courseChapters.length) * 100) : 0,
          locked: false,
        };
      });

      // Level gating: check if beginner courses are complete
      const beginnerComplete = coursesWithChapters
        .filter((c) => c.difficulty === "beginner")
        .every((c) => c.progress === 100);
      const intermediateComplete = coursesWithChapters
        .filter((c) => c.difficulty === "intermediate")
        .every((c) => c.progress === 100);

      return coursesWithChapters.map((c) => {
        let locked = false;
        if (c.difficulty === "intermediate" && !beginnerComplete) locked = true;
        if (c.difficulty === "advanced" && !intermediateComplete) locked = true;
        return { ...c, locked };
      });
    },
    enabled: !!user,
  });
}

export function useToggleChapter() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ chapterId, completed }: { chapterId: string; completed: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (completed) {
        // Mark incomplete
        const { error } = await supabase
          .from("user_chapter_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("chapter_id", chapterId);
        if (error) throw error;
      } else {
        // Mark complete
        const { error } = await supabase
          .from("user_chapter_completions")
          .insert({ user_id: user.id, chapter_id: chapterId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
