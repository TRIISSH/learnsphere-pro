import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

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
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 finance-grid min-h-screen">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Course Catalog</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Finance Courses</h1>
        <p className="text-muted-foreground mt-1">
          Master your money. Complete beginner courses to unlock intermediate, then advanced.
        </p>
      </motion.header>

      <div className="ticker-line w-full rounded-full" />

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
