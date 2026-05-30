import { supabase } from './client';
import { Project, CreateProjectInput, UpdateProjectInput, AppNotification } from '@types/project.types';

const SELECT_PROJECT = '*';

export const projectsService = {
  async listProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(SELECT_PROJECT)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Project[];
  },

  async listRecentProjects(userId: string, limit = 10): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(SELECT_PROJECT)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Project[];
  },

  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(SELECT_PROJECT)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Project | null;
  },

  async createProject(userId: string, input: CreateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title: input.title ?? 'Untitled Project',
        thumbnail_url: input.thumbnail_url ?? null,
        resolution: input.resolution ?? '1080p',
        frame_rate: input.frame_rate ?? 30,
        status: 'draft',
        timeline_data: {},
        metadata: {},
      })
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: UpdateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  subscribeToProject(id: string, onChange: (project: Project) => void): () => void {
    const channel = supabase
      .channel(`project_${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${id}` },
        payload => {
          if (payload.new) onChange(payload.new as Project);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  },
};

export const notificationsService = {
  async list(userId: string): Promise<AppNotification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as AppNotification[];
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
  },

  async unreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return count ?? 0;
  },
};
