import { Project } from "@/types/project";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Settings, Trash2 } from "lucide-react";

interface ProjectSettingsProps {
	projects: Project[];
	onDeleteProject?: (project: Project) => void;
}

export const ProjectSettings = ({ projects, onDeleteProject }: ProjectSettingsProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-4 right-4 hover:bg-[#8B5CF6]/20 text-white/70 hover:text-white"
				>
					<Settings className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-64 bg-[#2A2D3E]/95 backdrop-blur-lg border border-[#8B5CF6]/30 text-white">
				<DropdownMenuLabel className="text-white/70">Manage Projects</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-white/10" />
				{projects.map((project) => (
					<DropdownMenuItem
						key={project.id}
						className="flex items-center justify-between group hover:bg-[#8B5CF6]/20 cursor-pointer"
					>
						<span className="truncate">{project.title}</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500"
							onClick={(e) => {
								e.stopPropagation();
								onDeleteProject?.(project);
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};