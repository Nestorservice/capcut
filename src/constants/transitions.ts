export interface TransitionDefinition {
  id: string;
  name: string;
  xfadeName: string;
  defaultDuration: number;
  icon: string;
}

export const TRANSITIONS: TransitionDefinition[] = [
  { id: 'none', name: 'None', xfadeName: '', defaultDuration: 0, icon: 'block' },
  { id: 'fade', name: 'Fade', xfadeName: 'fade', defaultDuration: 0.5, icon: 'gradient' },
  { id: 'dissolve', name: 'Dissolve', xfadeName: 'dissolve', defaultDuration: 0.5, icon: 'blur-on' },
  { id: 'wipeleft', name: 'Wipe L', xfadeName: 'wipeleft', defaultDuration: 0.5, icon: 'swipe-left' },
  { id: 'wiperight', name: 'Wipe R', xfadeName: 'wiperight', defaultDuration: 0.5, icon: 'swipe-right' },
  { id: 'slidedown', name: 'Slide D', xfadeName: 'slidedown', defaultDuration: 0.5, icon: 'arrow-downward' },
  { id: 'slideup', name: 'Slide U', xfadeName: 'slideup', defaultDuration: 0.5, icon: 'arrow-upward' },
  { id: 'zoom', name: 'Zoom', xfadeName: 'circleopen', defaultDuration: 0.6, icon: 'zoom-in' },
  { id: 'pixelize', name: 'Pixelize', xfadeName: 'pixelize', defaultDuration: 0.5, icon: 'grid-view' },
  { id: 'radial', name: 'Radial', xfadeName: 'radial', defaultDuration: 0.5, icon: 'radar' },
  { id: 'smoothleft', name: 'Smooth L', xfadeName: 'smoothleft', defaultDuration: 0.5, icon: 'chevron-left' },
];

export const getTransitionById = (id: string): TransitionDefinition => {
  return TRANSITIONS.find(t => t.id === id) ?? TRANSITIONS[0];
};
