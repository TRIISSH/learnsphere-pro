import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const difficulties = ["all", "beginner", "intermediate", "advanced"] as const;

export default function Courses() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? courses : courses.filter((c) => c.difficulty === filter);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-1">Track your enrolled courses and progress</p>
      </header>

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
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No courses found for this filter.</p>
      )}
    </div>
  );
}
