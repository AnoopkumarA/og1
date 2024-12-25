import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { ProjectGrid } from '@/components/ProjectGrid';
import { ContributionGraph } from '@/components/ContributionGraph';
import { UserCount } from '@/components/UserCount';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Code2, Palette, Rocket, Globe, Figma, Box, Search, Link2, CheckCircle2, Github, Twitter, Linkedin } from "lucide-react";
import { useSupabase } from '@/contexts/SupabaseContext';
import { AuthButton } from '@/components/AuthButton';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCopied, setIsCopied] = useState(false);

  const copyProfileUrl = () => {
    if (userId) {
      navigator.clipboard.writeText(window.location.origin + `/profile/${userId}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (!data || data.length === 0) {
          setError('No projects found for this user.');
          return;
        }

        // Group projects by date and count them
        const projectsWithCount = data.map(project => {
          const date = new Date(project.created_at).toISOString().split('T')[0];
          const projectsOnSameDay = data.filter(p => 
            new Date(p.created_at).toISOString().split('T')[0] === date
          ).length;
          
          return {
            ...project,
            id: project.id.toString(),
            userId: project.user_id,
            createdAt: project.created_at,
            type: project.type,
            url: project.url,
            tags: project.tags,
            projectsInDay: projectsOnSameDay // Add count of projects on same day
          };
        });
        
        setProjects(projectsWithCount);
      } catch (error) {
        console.error('Error loading projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId]);

  // Add search filter function
  function filterProjects(projectsToFilter: Project[]) {
    if (!searchQuery) return projectsToFilter;
    
    const query = searchQuery.toLowerCase();
    return projectsToFilter.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  const filteredProjects = {
    all: filterProjects(projects),
    website: filterProjects(projects.filter(project => project.type === 'website')),
    figma: filterProjects(projects.filter(project => project.type === 'figma')),
    other: filterProjects(projects.filter(project => project.type === 'other'))
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#403E43]/30 backdrop-blur-lg border-b border-[#8B5CF6]/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="transition-transform duration-300 hover:scale-105"
            >
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] text-transparent bg-clip-text cursor-pointer relative"
              >
                <span className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-lg blur opacity-30 animate-pulse" />
                CodeSpace
              </motion.h1>
            </Link>
            <div className="flex items-center gap-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {user && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-24 right-8 z-40"
        >
          <Button
            variant="outline"
            size="sm"
            className="group relative overflow-hidden rounded-md bg-transparent px-3 py-1 transition-all duration-300 ease-out hover:scale-105 border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
            onClick={copyProfileUrl}
          >
            <span className="relative z-10 flex items-center gap-1 transition-colors duration-300 group-hover:text-white">
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="whitespace-nowrap">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span className="whitespace-nowrap">Share Profile</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Button>
        </motion.div>
      )}

      <div className="container mx-auto py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] rounded-lg blur opacity-30 animate-pulse" />
            <h2 className="relative bg-black px-4 py-2 rounded-lg">
              <span className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] text-transparent bg-clip-text">
                Project Portfolio
              </span>
              <div className="absolute top-0 right-0 mt-1 mr-1">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
              </div>
              <div className="absolute bottom-0 left-0 mb-1 ml-1">
                <div className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-ping animation-delay-500" />
              </div>
            </h2>
          </div>
          <div className="relative max-w-2xl mx-auto group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <div className="font-mono space-y-2">
                <div className="text-[#8B5CF6] opacity-60">// Developer profile initialized</div>
                <div>
                  <span className="text-[#D946EF]">class</span>
                  <span className="text-[#0EA5E9]"> Portfolio</span>
                  <span className="text-gray-300"> {`{`}</span>
                </div>
                <div className="pl-4">
                  <span className="text-[#8B5CF6]">skills:</span>
                  <span className="text-gray-300"> [</span>
                  <span className="text-[#0EA5E9]">'innovation'</span>
                  <span className="text-gray-300">,</span>
                  <span className="text-[#0EA5E9]">'creativity'</span>
                  <span className="text-gray-300">,</span>
                  <span className="text-[#0EA5E9]">'excellence'</span>
                  <span className="text-gray-300">],</span>
                </div>
                <div className="pl-4">
                  <span className="text-[#8B5CF6]">goal:</span>
                  <span className="text-[#0EA5E9]">'build_amazing_things()'</span>
                </div>
                <div className="text-gray-300">{`}`};</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text mb-4">
            {/* User Profile */}
          </h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative">
                <div className="relative bg-[#1A1F2C] rounded-lg p-2 ring-1 ring-[#8B5CF6]/20">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8B5CF6] w-5 h-5 transition-colors group-hover:text-[#D946EF]" />
                  <Input
                    type="text"
                    placeholder="Search projects by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full bg-transparent border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
            {searchQuery && (
              <div className="absolute right-3 -bottom-6 text-sm text-gray-400">
                {filteredProjects.all.length} results found
              </div>
            )}
          </motion.div>

          {error ? (
            <div className="text-red-500 mt-4">{error}</div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]" />
            </div>
          ) : (
            <>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    All Projects ({filteredProjects.all.length})
                  </TabsTrigger>
                  <TabsTrigger value="website" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Websites ({filteredProjects.website.length})
                  </TabsTrigger>
                  <TabsTrigger value="figma" className="flex items-center gap-2">
                    <Figma className="w-4 h-4" />
                    Figma Designs ({filteredProjects.figma.length})
                  </TabsTrigger>
                  <TabsTrigger value="other" className="flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Other ({filteredProjects.other.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <ProjectGrid projects={filteredProjects.all} />
                </TabsContent>
                <TabsContent value="website">
                  <ProjectGrid projects={filteredProjects.website} />
                </TabsContent>
                <TabsContent value="figma">
                  <ProjectGrid projects={filteredProjects.figma} />
                </TabsContent>
                <TabsContent value="other">
                  <ProjectGrid projects={filteredProjects.other} />
                </TabsContent>
              </Tabs>
              
            </>
          )}
        </motion.div>
        <main className="container mx-auto py-2">
              {!loading && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 mb-1 max-w-5xl mx-auto"
                >
                <ContributionGraph projects={projects} />
                <UserCount />
                </motion.div>
              )}
              </main>
      </div>
      <footer className="bg-black/50 backdrop-blur-sm border-t border-purple-500/20 py-4">
        <div className="container mx-auto text-center">
          <div className="text-[#8B5CF6] opacity-60">// Connect with us</div>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-[#D946EF] hover:underline">About</a>
            <a href="#" className="text-[#D946EF] hover:underline">Contact</a>
            <a href="#" className="text-[#D946EF] hover:underline">Privacy Policy</a>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#D946EF] hover:scale-110 transition-transform duration-300"><Github className="w-6 h-6" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#D946EF] hover:scale-110 transition-transform duration-300"><Twitter className="w-6 h-6" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#D946EF] hover:scale-110 transition-transform duration-300"><Linkedin className="w-6 h-6" /></a>
          </div>
          <div className="mt-4 text-gray-300 text-sm">
            <span className="text-[#8B5CF6]">&copy;</span> 
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">2024 Project Showcase</span>. 
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
