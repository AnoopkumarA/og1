import { useState, useEffect } from "react";
import { isFigmaUrl, getFigmaPreviewUrl, getFigmaFileKey } from "@/utils/figma";
import { isDribbbleUrl, getDribbbleImageUrl } from "@/utils/dribbble";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PlusCircle, Link, Tags, Type, FileText, Sparkles, Image as ImageIcon } from "lucide-react";
import { Project, ProjectType } from "@/types/project";
import { toast, useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { useSupabase } from "@/contexts/SupabaseContext";
import { supabase } from "@/lib/supabase";
import { projectsService } from "@/lib/projects";
import { title } from "process";

interface AddProjectDialogProps {
  onProjectAdd: (project: Project & { isNewProject?: boolean }) => void;
}

export const AddProjectDialog = ({ onProjectAdd }: AddProjectDialogProps) => {
  const { user } = useSupabase();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<ProjectType>("website" as ProjectType);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [figmaPreview, setFigmaPreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPreview = async () => {
      if (url && type === "figma" && isFigmaUrl(url)) {
        const fileKey = getFigmaFileKey(url);
        if (fileKey && user) {  
          const figmaPreviewUrl = url.includes('community/file') 
            ? `https://www.figma.com/community/file/${fileKey}/thumbnail`
            : `https://www.figma.com/file/${fileKey}/thumbnail?ver=thumbnail`;
          
          try {
            const response = await fetch(figmaPreviewUrl);
            if (response.ok) {
              setImagePreview(figmaPreviewUrl);
              
              const blob = await response.blob();
              const file = new File([blob], 'figma-preview.png', { type: 'image/png' });
              setImageFile(file);
            } else {
              toast({
                title: "Preview not available",
                description: "Please ensure you're logged in and have access to the Figma file",
                variant: "default",
              });
            }
          } catch (error) {
            console.error('Error loading Figma preview:', error);
          }
        }
      } else if (type === "other" && isDribbbleUrl(url)) {
        const imageUrl = getDribbbleImageUrl(url);
        if (imageUrl && !imageFile) {
          try {
            const response = await fetch(imageUrl);
            if (response.ok) {
              const blob = await response.blob();
              const file = new File([blob], 'dribbble-preview.png', { type: 'image/png' });
              setImageFile(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          } catch (error) {
            console.error('Error loading Dribbble preview:', error);
          }
        }
      }
    };
  
    loadPreview();
  }, [url, type, imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a project",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const projectData = {
        title,
        description,
        type,
        url,
        image_url: imageUrl, 
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

        const newProject: Project = {
        id: data.id.toString(),
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        imageUrl: data.image_url, 
        tags: data.tags,
        createdAt: data.created_at,
        category: data.type,
        };

        await new Promise(resolve => setTimeout(resolve, 2000));

        onProjectAdd({ ...newProject, isNewProject: true });
        setOpen(false);
        resetForm();

      toast({
        title: "Success",
        description: "Project added successfully",
      });
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setType("website" as ProjectType);
    setTags("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <Button className="relative bg-black/50 backdrop-blur-sm text-white font-medium px-6 py-2.5 rounded-full border border-purple-500/20 flex items-center gap-2 hover:bg-black/60 transition-all duration-300">
              <PlusCircle className="w-5 h-5 text-[#8B5CF6]" />
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">Add Project</span>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-b from-[#1A1F2C] to-[#1A1F2C]/95 border border-[#8B5CF6]/20 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
          Add New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B5CF6]" />
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
              className="bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500 focus:border-[#D946EF] transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#8B5CF6]" />
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              required
              className="bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#8B5CF6]" />
              Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="w-full rounded-md border border-[#8B5CF6]/20 bg-[#403E43]/30 px-3 py-2 text-white"
            >
              <option value="website">Website</option>
              <option value="figma">Figma</option>
              <option value="other">Others</option>
            </select>
            </div>
            <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-300 flex items-center gap-2">
              <Link className="w-4 h-4 text-[#8B5CF6]" />
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Project URL"
              required
              className="bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />

            </div>
            <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
              Project Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-[#403E43]/30 border-[#8B5CF6]/20 text-white file:text-white file:bg-[#8B5CF6] file:border-0 cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              </div>
            )}
            </div>
            <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300 flex items-center gap-2">
              <Tags className="w-4 h-4 text-[#8B5CF6]" />
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, TypeScript, UI/UX"
              className="bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />
          </div>
            <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white"
            disabled={loading}
            >
            {loading ? "Adding..." : "Add Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
function onProjectAdd(arg0: { isNewProject: boolean; id: string; title: string; description: string; type: ProjectType; url: string; imageUrl?: string; githubUrl?: string; tags: string[]; createdAt: string; category: import("@/types/project").ProjectCategory; }) {
  throw new Error("Function not implemented.");
}

function setOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function loadPreview() {
  throw new Error("Function not implemented.");
}

function setTitle(arg0: string) {
  throw new Error("Function not implemented.");
}

function setDescription(arg0: string) {
  throw new Error("Function not implemented.");
}

function setUrl(arg0: string) {
  throw new Error("Function not implemented.");
}

function setType(arg0: ProjectType) {
  throw new Error("Function not implemented.");
}

function setTags(arg0: string) {
  throw new Error("Function not implemented.");
}

function setImagePreview(arg0: null) {
  throw new Error("Function not implemented.");
}
