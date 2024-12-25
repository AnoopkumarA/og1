export enum ProjectType {
  WEBSITE = 'website',
  FIGMA = 'figma',
  OTHER = 'other'
}

export type ProjectCategory = 'website' | 'figma' | 'other';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  url: string;
  imageUrl?: string;
  githubUrl?: string;
  tags: string[];
  createdAt: string;
  category: ProjectCategory;
  isNewProject?: boolean;
}


export interface ProjectFormData {
  title: string;
  description: string;
  imageFile?: File;
  url: string;
  type: ProjectType;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  projects: Project[];
}

