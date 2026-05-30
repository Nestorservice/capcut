import { create } from 'zustand';
import { Project } from '@types/project.types';

interface ProjectState {
  projects: Project[];
  recentProjects: Project[];
  currentProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  setRecentProjects: (projects: Project[]) => void;
  setCurrentProjectId: (id: string | null) => void;
  upsertProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>(set => ({
  projects: [],
  recentProjects: [],
  currentProjectId: null,
  setProjects: projects => set({ projects }),
  setRecentProjects: recentProjects => set({ recentProjects }),
  setCurrentProjectId: id => set({ currentProjectId: id }),
  upsertProject: project =>
    set(s => {
      const existsIn = s.projects.find(p => p.id === project.id);
      return {
        projects: existsIn ? s.projects.map(p => (p.id === project.id ? project : p)) : [project, ...s.projects],
      };
    }),
  removeProject: id =>
    set(s => ({
      projects: s.projects.filter(p => p.id !== id),
      recentProjects: s.recentProjects.filter(p => p.id !== id),
    })),
}));
