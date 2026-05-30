export interface FilterDefinition {
  id: string;
  name: string;
  filterGraph: string;
  category: 'basic' | 'cinematic' | 'mood' | 'mono';
}

export const FILTERS: FilterDefinition[] = [
  { id: 'none', name: 'None', filterGraph: '', category: 'basic' },
  {
    id: 'cinematic',
    name: 'Cinematic',
    filterGraph:
      'curves=r=0/0 0.5/0.4 1/0.9:g=0/0 0.5/0.5 1/0.85:b=0/0.1 0.5/0.5 1/0.8',
    category: 'cinematic',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    filterGraph:
      'curves=r=0/0.1 0.5/0.6 1/0.9:g=0/0 0.5/0.45 1/0.8:b=0/0.05 0.5/0.4 1/0.7,vignette=PI/5',
    category: 'mood',
  },
  {
    id: 'neon',
    name: 'Neon',
    filterGraph:
      'curves=r=0/0 0.5/0.7 1/1:g=0/0 0.5/0.3 1/0.8:b=0/0 0.5/0.8 1/1,unsharp=5:5:1.5:5:5:0',
    category: 'cinematic',
  },
  {
    id: 'portrait',
    name: 'Portrait',
    filterGraph: 'eq=brightness=0.1:saturation=1.2:contrast=1.05',
    category: 'basic',
  },
  {
    id: 'landscape',
    name: 'Landscape',
    filterGraph: 'curves=b=0/0 0.5/0.6 1/1,eq=saturation=1.3:contrast=1.1',
    category: 'basic',
  },
  {
    id: 'warm',
    name: 'Warm',
    filterGraph: 'curves=r=0/0 0.5/0.6 1/1:b=0/0 0.5/0.4 1/0.85',
    category: 'mood',
  },
  {
    id: 'cold',
    name: 'Cold',
    filterGraph: 'curves=r=0/0 0.5/0.4 1/0.85:b=0/0 0.5/0.6 1/1',
    category: 'mood',
  },
  {
    id: 'bw',
    name: 'B&W',
    filterGraph: 'hue=s=0,curves=all=0/0 0.5/0.5 1/1',
    category: 'mono',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    filterGraph:
      'eq=contrast=1.4:brightness=-0.1:saturation=0.8,vignette=PI/4',
    category: 'cinematic',
  },
];

export const getFilterById = (id: string): FilterDefinition => {
  return FILTERS.find(f => f.id === id) ?? FILTERS[0];
};
