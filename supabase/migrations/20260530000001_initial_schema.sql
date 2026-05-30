-- CapCut Clone — initial schema

-- Users / profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  cloudinary_folder TEXT,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 15728640000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  thumbnail_url TEXT,
  cloudinary_public_id TEXT,
  video_url TEXT,
  duration FLOAT,
  resolution TEXT DEFAULT '1080p',
  frame_rate INTEGER DEFAULT 30,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','processing','completed','failed')),
  timeline_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  file_size BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline clips
CREATE TABLE public.clips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cloudinary_public_id TEXT NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  start_time FLOAT DEFAULT 0,
  end_time FLOAT NOT NULL,
  duration FLOAT NOT NULL,
  position INTEGER NOT NULL,
  speed FLOAT DEFAULT 1.0,
  volume FLOAT DEFAULT 1.0,
  is_muted BOOLEAN DEFAULT FALSE,
  transform_data JSONB DEFAULT '{}',
  filter_data JSONB DEFAULT '{}',
  keyframes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Text overlays
CREATE TABLE public.text_overlays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  font_family TEXT DEFAULT 'Default',
  font_size INTEGER DEFAULT 32,
  font_weight TEXT DEFAULT 'bold',
  color TEXT DEFAULT '#ffffff',
  background_color TEXT,
  position_x FLOAT DEFAULT 0.5,
  position_y FLOAT DEFAULT 0.5,
  scale FLOAT DEFAULT 1.0,
  rotation FLOAT DEFAULT 0,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  animation_in TEXT,
  animation_out TEXT,
  animation_loop TEXT,
  style_data JSONB DEFAULT '{}'
);

-- Audio tracks
CREATE TABLE public.audio_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  cloudinary_public_id TEXT,
  url TEXT NOT NULL,
  title TEXT,
  artist TEXT,
  duration FLOAT NOT NULL,
  start_time FLOAT DEFAULT 0,
  "offset" FLOAT DEFAULT 0,
  volume FLOAT DEFAULT 1.0,
  is_muted BOOLEAN DEFAULT FALSE,
  track_type TEXT DEFAULT 'music' CHECK (track_type IN ('music','voiceover','extracted','sfx')),
  fade_in FLOAT DEFAULT 0,
  fade_out FLOAT DEFAULT 0
);

-- Sticker overlays
CREATE TABLE public.sticker_overlays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  sticker_id TEXT NOT NULL,
  sticker_url TEXT NOT NULL,
  position_x FLOAT DEFAULT 0.5,
  position_y FLOAT DEFAULT 0.5,
  scale FLOAT DEFAULT 1.0,
  rotation FLOAT DEFAULT 0,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX projects_user_id_idx ON public.projects(user_id);
CREATE INDEX projects_updated_at_idx ON public.projects(updated_at DESC);
CREATE INDEX clips_project_id_idx ON public.clips(project_id);
CREATE INDEX text_overlays_project_id_idx ON public.text_overlays(project_id);
CREATE INDEX audio_tracks_project_id_idx ON public.audio_tracks(project_id);
CREATE INDEX sticker_overlays_project_id_idx ON public.sticker_overlays(project_id);
CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX notifications_unread_idx ON public.notifications(user_id) WHERE is_read = FALSE;

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.text_overlays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sticker_overlays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own projects"
  ON public.projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own clips"
  ON public.clips FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own text overlays"
  ON public.text_overlays FOR ALL
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own audio tracks"
  ON public.audio_tracks FOR ALL
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own stickers"
  ON public.sticker_overlays FOR ALL
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url, cloudinary_folder)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'captcut/' || NEW.id::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
