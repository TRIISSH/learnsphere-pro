import { courses } from "@/lib/data";
import CourseCard from "@/components/CourseCard";
import { Lightbulb, ArrowRight } from "lucide-react";

const tips = [
  { title: "Focus on weak areas", desc: "Your Organic Chemistry score is below average. Consider reviewing reaction mechanisms." },
  { title: "Increase study consistency", desc: "You study most on weekends. Try adding 30 min on weekdays for better retention." },
  { title: "Try spaced repetition", desc: "Review Machine Learning concepts every 3 days to improve long-term recall." },
];

export default function Recommendations() {
  const recommended = courses.filter((c) => c.recommended);
  const lowScore = courses.filter((c) => c.score < 80).sort((a, b) => a.score - b.score);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Personalized For You</h1>
        <p className="text-muted-foreground mt-1">AI-powered recommendations based on your learning patterns</p>
      </header>

      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" /> Smart Tips
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="rounded-xl border border-accent/20 bg-accent/5 p-5 space-y-2 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="font-heading font-semibold text-sm">{tip.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              <button className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg">Recommended Courses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg">Needs Attention</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowScore.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
