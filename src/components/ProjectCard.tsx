import { Project, ProjectType } from "@/types/project";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PreviewDialog } from "./PreviewDialog";
import { isYouTubeUrl, getYouTubeVideoId, getYouTubeThumbnailUrl } from "@/utils/youtube";
import { isFigmaUrl, getFigmaFileKey, getFigmaThumbnailUrl } from "@/utils/figma";

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
  isNewProject?: boolean;
}

export const ProjectCard = ({ project, onView, isNewProject = false }: ProjectCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isNewProject);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const loadPreview = async () => {
      if (project.url) {
        if (isYouTubeUrl(project.url)) {
          const videoId = getYouTubeVideoId(project.url);
          if (videoId) {
            setThumbnailUrl(getYouTubeThumbnailUrl(videoId));
          }
        } else if (isFigmaUrl(project.url)) {
          const fileKey = getFigmaFileKey(project.url);
          if (fileKey) {
            // For Figma files, prioritize uploaded image, then fall back to thumbnail
            const figmaThumbnail = getFigmaThumbnailUrl(fileKey);
            setThumbnailUrl(project.imageUrl || figmaThumbnail);
          }
        }
      }
    };

    loadPreview();

    if (isNewProject) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [project.url, project.imageUrl, isNewProject]);


  const getPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full bg-[#2A2D3E] flex items-center justify-center relative">
          <div className="flex flex-col items-center justify-center min-h-full w-full bg-gray-900 text-green-500 font-mono relative">
            {/* Hexagon Container */}
            <div className="relative w-20 h-20">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-2 border-green-500 opacity-30 animate-spin"
                  style={{
                    clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                    transform: `rotate(${i * 30}deg)`,
                    animationDuration: `${3 + i}s`
                  }}
                />
              ))}
              
              <div className="absolute inset-2 rounded-full bg-gray-800 flex items-center justify-center">
                <div className="text-lg font-bold animate-pulse">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                    &lt;/&gt;
                  </span>
                </div>
              </div>
            </div>

            {/* Loading Status */}
            <div className="mt-4 text-sm w-full text-center px-4"></div>
              <div className="h-6 overflow-hidden">
                <div className="animate-pulse">
                  Initializing Preview...
                </div>
              </div>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto w-32">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 animate-progress"
                />
              </div>
            </div>
          </div>
      );
    }
    if (project.type === ProjectType.FIGMA) {
      return (
      <div className="w-full h-full bg-[#2A2D3E] flex items-center justify-center">
        <img
        src={project.imageUrl || thumbnailUrl || "/placeholder.svg"}
        alt={project.title}
        className="w-full h-full object-cover"
        className="w-full h-full object-cover"
        onError={(e) => {
          setIframeError(true);
          e.currentTarget.src = "/placeholder.svg";
        }}
        />
      </div>
      );
    }

    if (project.type === ProjectType.WEBSITE && !iframeError) {
      return (
      <div className="relative w-full h-full bg-[#2A2D3E]">
      {!iframeLoaded && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
      )}
        <iframe
        src={project.url}
        className={`w-full h-full border-0 transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: 'scale(0.75)',
          transformOrigin: '0 0',
          width: '133.33%',
          height: '133.33%',
          pointerEvents: 'none'
        }}
        title={project.title}
        onError={() => {
          setIframeError(true);
          setIframeLoaded(false);
        }}
        onLoad={() => {
          setIframeLoaded(true);
          setIframeError(false);
        }}
        sandbox="allow-same-origin allow-scripts"
        loading="lazy"
        scrolling="no"
        />
      </div>
      );
    }

    return (
      <div className="w-full h-full bg-[#2A2D3E] flex items-center justify-center">
      <img
        src={project.imageUrl || thumbnailUrl || "/placeholder.svg"}
        alt={project.title}
        className="w-full h-full object-cover"
        onError={(e) => {
        setIframeError(true);
        e.currentTarget.src = "/placeholder.svg";
        }}
      />
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="relative bg-[#0A192F] overflow-hidden group hover:shadow-xl transition-all duration-300 backdrop-blur-lg border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#0EA5E9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {getPreviewContent()}
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="flex gap-3 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative overflow-hidden bg-transparent border border-[#8B5CF6] text-white hover:text-white group/btn"
                    onClick={() => setShowPreview(true)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative overflow-hidden bg-transparent border border-[#0EA5E9] text-white hover:text-white group/btn"
                    onClick={() => window.open(project.url, "_blank")}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Visit
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-left relative z-10">
            <h3 className="font-bold text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] group-hover:from-[#D946EF] group-hover:to-[#8B5CF6] transition-all duration-300">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge
                  key={tag}
                  className="relative overflow-hidden px-3 py-1 bg-[#1E293B] border border-[#8B5CF6]/20 text-xs font-medium text-gray-300 group-hover:border-[#8B5CF6]/40 transition-all duration-300 hover:scale-105 cursor-default"
                  style={{
                    animation: `pulseGlow ${2 + index * 0.2}s infinite`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9]" />
                    {tag}
                  </span>
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'
                    }}
                  />
                </Badge>
              ))}
            </div>
            <style jsx global>{`
              @keyframes pulseGlow {
                0%, 100% {
                  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
                }
                50% {
                  box-shadow: 0 0 4px 1px rgba(139, 92, 246, 0.2);
                }
              }
            `}</style>
          </CardContent>
        </Card>
      </motion.div>

      <PreviewDialog 
        project={project}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </>
  );
};
