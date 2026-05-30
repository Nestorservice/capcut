import { useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@services/supabase/projects.service';
import { useAuthStore } from '@store/authStore';
import { useProjectStore } from '@store/projectStore';
import { Project, CreateProjectInput, UpdateProjectInput } from '@types/project.types';

export function useProjects() {
  const userId = useAuthStore(s => s.user?.id);
  const setProjects = useProjectStore(s => s.setProjects);
  const setRecentProjects = useProjectStore(s => s.setRecentProjects);
  const upsertProject = useProjectStore(s => s.upsertProject);
  const removeProjectLocal = useProjectStore(s => s.removeProject);
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ['projects', userId],
    queryFn: () => (userId ? projectsService.listProjects(userId) : Promise.resolve([])),
    enabled: !!userId,
  });

  const recent = useQuery({
    queryKey: ['projects', userId, 'recent'],
    queryFn: () => (userId ? projectsService.listRecentProjects(userId, 10) : Promise.resolve([])),
    enabled: !!userId,
  });

  useEffect(() => {
    if (list.data) setProjects(list.data);
  }, [list.data, setProjects]);

  useEffect(() => {
    if (recent.data) setRecentProjects(recent.data);
  }, [recent.data, setRecentProjects]);

  const create = useMutation({
    mutationFn: (input: CreateProjectInput) => {
      if (!userId) throw new Error('Not authenticated');
      return projectsService.createProject(userId, input);
    },
    onSuccess: project => {
      upsertProject(project);
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateProjectInput }) =>
      projectsService.updateProject(id, updates),
    onSuccess: project => {
      upsertProject(project);
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: (_, id) => {
      removeProjectLocal(id);
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });

  const refresh = useCallback(() => {
    void list.refetch();
    void recent.refetch();
  }, [list, recent]);

  return {
    projects: (list.data ?? []) as Project[],
    recentProjects: (recent.data ?? []) as Project[],
    isLoading: list.isLoading || recent.isLoading,
    isError: list.isError || recent.isError,
    error: list.error ?? recent.error,
    createProject: create.mutateAsync,
    updateProject: update.mutateAsync,
    deleteProject: remove.mutateAsync,
    isCreating: create.isPending,
    refresh,
  };
}
