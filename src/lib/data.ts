export interface Course {
  id: string;
  title: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  totalLessons: number;
  completedLessons: number;
  score: number;
  icon: string;
  recommended?: boolean;
}

export interface PerformanceData {
  date: string;
  score: number;
  timeSpent: number;
}

export interface WeeklyActivity {
  day: string;
  hours: number;
}

export const courses: Course[] = [
  { id: "1", title: "Linear Algebra", subject: "Mathematics", difficulty: "intermediate", progress: 72, totalLessons: 24, completedLessons: 17, score: 85, icon: "📐" },
  { id: "2", title: "Organic Chemistry", subject: "Science", difficulty: "advanced", progress: 45, totalLessons: 30, completedLessons: 13, score: 78, icon: "🧪" },
  { id: "3", title: "World History", subject: "Humanities", difficulty: "beginner", progress: 90, totalLessons: 20, completedLessons: 18, score: 92, icon: "🌍" },
  { id: "4", title: "Machine Learning", subject: "Computer Science", difficulty: "advanced", progress: 33, totalLessons: 36, completedLessons: 12, score: 71, icon: "🤖" },
  { id: "5", title: "Creative Writing", subject: "Language Arts", difficulty: "beginner", progress: 60, totalLessons: 16, completedLessons: 10, score: 88, icon: "✍️", recommended: true },
  { id: "6", title: "Data Structures", subject: "Computer Science", difficulty: "intermediate", progress: 55, totalLessons: 28, completedLessons: 15, score: 80, icon: "🏗️", recommended: true },
];

export const performanceHistory: PerformanceData[] = [
  { date: "Jan", score: 65, timeSpent: 12 },
  { date: "Feb", score: 70, timeSpent: 15 },
  { date: "Mar", score: 68, timeSpent: 14 },
  { date: "Apr", score: 75, timeSpent: 18 },
  { date: "May", score: 80, timeSpent: 20 },
  { date: "Jun", score: 78, timeSpent: 17 },
  { date: "Jul", score: 85, timeSpent: 22 },
  { date: "Aug", score: 82, timeSpent: 19 },
  { date: "Sep", score: 88, timeSpent: 24 },
  { date: "Oct", score: 90, timeSpent: 25 },
];

export const weeklyActivity: WeeklyActivity[] = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.0 },
  { day: "Fri", hours: 1.5 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 3.5 },
];

export const subjectBreakdown = [
  { name: "Personal Finance", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "Investing", value: 35, fill: "hsl(var(--chart-2))" },
  { name: "Wealth Management", value: 30, fill: "hsl(var(--chart-3))" },
];
