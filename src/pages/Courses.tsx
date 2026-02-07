import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const difficulties = ["all", "beginner", "intermediate", "advanced"] as const;

export default function Courses() {
  const [filter, setFilter] = useState<string>("all");
  const { data: courses, isLoading } = useCourses();

  const filtered = filter === "all" ? courses : courses?.filter((c) => c.difficulty === filter);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-1">
          Track your enrolled courses and progress. Complete beginner courses to unlock intermediate, and intermediate to unlock advanced.
        </p>
      </motion.header>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {difficulties.map((d) => (
            <TabsTrigger key={d} value={d} className="capitalize text-xs">
              {d}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>

      {filtered?.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No courses found for this filter.</p>
      )}
    </div>
  );
}
