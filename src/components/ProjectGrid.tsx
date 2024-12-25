import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectSettings } from "./ProjectSettings";
import { motion } from 'framer-motion';

interface ProjectGridProps {
  projects: Project[];
  onViewProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

export const ProjectGrid = ({ projects, onViewProject, onDeleteProject }: ProjectGridProps) => {
  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="flex justify-end mb-4">
        <ProjectSettings 
          projects={projects} 
          onDeleteProject={onDeleteProject} 
        />
      </div>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ProjectCard 
              project={project} 
              onView={onViewProject}
              onDelete={onDeleteProject}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
