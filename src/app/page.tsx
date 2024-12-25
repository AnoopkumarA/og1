"use client";

import { ProjectGrid } from "@/components/ProjectGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Project } from "@/types/project";

export default function Home() {
	const [selectedTab, setSelectedTab] = useState("all");
	const [projects, setProjects] = useState<Project[]>([
		// Add sample project for testing
		{
			id: "1",
			title: "Sample Project",
			description: "This is a sample project description",
			imageUrl: "/placeholder.svg",
			url: "https://example.com",
			type: "website",
			tags: ["React", "TypeScript"],
			createdAt: new Date().toISOString(),
			category: "website"
		}
	]);

	const filteredProjects = projects.filter(project => {
		if (selectedTab === "all") return true;
		return project.type === selectedTab;
	});

	return (
		<main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
			<div className="max-w-4xl mx-auto space-y-8">
				<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-center mb-8">
					My Projects
				</h1>
				
				<Tabs defaultValue="all" onValueChange={setSelectedTab}>
					<TabsList className="w-full justify-start bg-gray-800/50 p-1">
						<TabsTrigger value="all">All Projects</TabsTrigger>
						<TabsTrigger value="website">Websites</TabsTrigger>
						<TabsTrigger value="figma">Figma</TabsTrigger>
						<TabsTrigger value="other">Other</TabsTrigger>
					</TabsList>
					
					<TabsContent value="all" className="mt-6">
						<ProjectGrid projects={filteredProjects} />
					</TabsContent>
					<TabsContent value="website" className="mt-6">
						<ProjectGrid projects={filteredProjects} />
					</TabsContent>
					<TabsContent value="figma" className="mt-6">
						<ProjectGrid projects={filteredProjects} />
					</TabsContent>
					<TabsContent value="other" className="mt-6">
						<ProjectGrid projects={filteredProjects} />
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}