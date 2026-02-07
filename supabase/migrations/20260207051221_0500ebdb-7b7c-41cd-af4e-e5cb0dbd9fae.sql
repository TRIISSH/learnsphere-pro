
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  student_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Courses table (public read)
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📚',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are publicly readable" ON public.courses FOR SELECT USING (true);

-- Chapters table (public read)
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  chapter_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are publicly readable" ON public.chapters FOR SELECT USING (true);

-- User chapter completions
CREATE TABLE public.user_chapter_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

ALTER TABLE public.user_chapter_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own completions" ON public.user_chapter_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON public.user_chapter_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own completions" ON public.user_chapter_completions FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed courses
INSERT INTO public.courses (title, subject, difficulty, icon, sort_order) VALUES
  ('Linear Algebra', 'Mathematics', 'intermediate', '📐', 1),
  ('Organic Chemistry', 'Science', 'advanced', '🧪', 2),
  ('World History', 'Humanities', 'beginner', '🌍', 3),
  ('Machine Learning', 'Computer Science', 'advanced', '🤖', 4),
  ('Creative Writing', 'Language Arts', 'beginner', '✍️', 5),
  ('Data Structures', 'Computer Science', 'intermediate', '🏗️', 6);

-- Seed 10 chapters per course
DO $$
DECLARE
  course_rec RECORD;
  chapter_titles TEXT[];
  i INT;
BEGIN
  FOR course_rec IN SELECT id, title FROM public.courses LOOP
    FOR i IN 1..10 LOOP
      INSERT INTO public.chapters (course_id, title, chapter_order)
      VALUES (course_rec.id, 'Chapter ' || i || ': ' || 
        CASE course_rec.title
          WHEN 'Linear Algebra' THEN (ARRAY['Vectors & Spaces','Matrix Operations','Determinants','Eigenvalues','Linear Transformations','Inner Products','Orthogonality','Least Squares','Singular Values','Applications'])[i]
          WHEN 'Organic Chemistry' THEN (ARRAY['Carbon Bonding','Alkanes','Stereochemistry','Alkenes','Alkynes','Aromatic Compounds','Alcohols & Ethers','Aldehydes & Ketones','Carboxylic Acids','Amines'])[i]
          WHEN 'World History' THEN (ARRAY['Ancient Civilizations','Classical Greece','Roman Empire','Medieval Europe','Renaissance','Age of Exploration','Industrial Revolution','World War I','World War II','Modern Era'])[i]
          WHEN 'Machine Learning' THEN (ARRAY['Introduction to ML','Linear Regression','Classification','Decision Trees','Neural Networks','Deep Learning','CNNs','RNNs','Reinforcement Learning','ML in Practice'])[i]
          WHEN 'Creative Writing' THEN (ARRAY['Finding Your Voice','Character Development','Plot Structure','Dialogue','Setting & Atmosphere','Point of View','Conflict & Tension','Revision Techniques','Poetry Basics','Publishing'])[i]
          WHEN 'Data Structures' THEN (ARRAY['Arrays & Lists','Stacks & Queues','Linked Lists','Trees','Binary Search Trees','Heaps','Hash Tables','Graphs','Sorting Algorithms','Advanced Topics'])[i]
        END,
        i);
    END LOOP;
  END LOOP;
END $$;
