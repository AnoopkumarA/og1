import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Project } from "@/types/project";
import { Badge } from "./ui/badge";
import { ExternalLink, Github, Download, Eye, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Twitter as XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { isYouTubeUrl, getYouTubeVideoId, getYouTubeThumbnailUrl, getYouTubeStats, YouTubeStats } from "@/utils/youtube";
import { isFigmaUrl, getFigmaFileKey, getFigmaThumbnailUrl } from "@/utils/figma";

const getYouTubeEmbedUrl = (url: string): string => {
	const videoId = getYouTubeVideoId(url);
	return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};




interface PreviewDialogProps {
	project: Project;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const PreviewDialog = ({ project, open, onOpenChange }: PreviewDialogProps) => {
	const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
	const [youtubeStats, setYoutubeStats] = useState<YouTubeStats | null>(null);

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
				} else {
					setThumbnailUrl(null);
				}
			}
		};
		
		loadPreview();
	}, [project.url, project.imageUrl]);

	// Creating the technologies string for social sharing
	const technologies = project.tags?.join(", ") || "No technologies listed";

	const shareText = `🎉 I'm excited to share my new project in the world of creativity! \n\n🚀 Check out this amazing project: **${project.title}**\n🔗 ${project.url}\n\n🔧 Technologies used: ${technologies}\n\n#WebDevelopment #AI #OpenSource`;

	// URLs for sharing
	const shareUrl = window.location.href; // Assuming the project URL is the current page URL

	// Twitter Share URL
	const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

	// Modal state for ZIP Download
	const [zipModalOpen, setZipModalOpen] = useState(false);

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="bg-gradient-to-b from-[#1A1F2C] to-[#1A1F2C]/95 border border-[#8B5CF6]/20 backdrop-blur-xl text-white max-w-xl p-4">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
							{project.title}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-5">
						{/* Project Preview */}
						<div className="relative aspect-video rounded-md overflow-hidden">
							{project.type === "website" && !thumbnailUrl ? (
								<iframe
									src={project.url}
									className="w-full h-full border-0"
									title={project.title}
									allowFullScreen
								/>
							) : project.type === "figma" ? (
								<div className="w-full h-full bg-[#2A2D3E] flex items-center justify-center">
									<img
										src={project.imageUrl || thumbnailUrl || "/placeholder.svg"}
										alt={project.title}
										className="w-full h-full object-cover"
										onError={(e) => {
											e.currentTarget.src = "/placeholder.svg";
										}}
									/>
								</div>
							) : isYouTubeUrl(project.url) ? (
								<iframe
									src={getYouTubeEmbedUrl(project.url)}
									className="w-full h-full border-0"
									title={project.title}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
								/>
							) : (
								<img
									src={thumbnailUrl || project.imageUrl || "/placeholder.svg"}
									alt={project.title}
									className="w-full h-full object-cover"
								/>
							)}

						</div>

						{/* Description */}
						<div>
							<h3 className="text-lg font-semibold mb-1">Description</h3>
							<p className="text-gray-300 text-base">{project.description || "No description provided."}</p>
						</div>

						{/* Technologies */}
						<div>
							<h3 className="text-lg font-semibold mb-1">Technologies</h3>
							<div className="flex flex-wrap gap-2">
								{project.tags?.map((tag) => (
									<Badge
										key={tag}
										className="bg-[#8B5CF6]/10 text-[#D946EF] border border-[#8B5CF6]/20 text-sm px-2 py-1"
									>
										{tag}
									</Badge>
								)) || <p className="text-gray-300 text-base">No technologies listed.</p>}
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-4 mt-6">
						{/* Visit Website Button */}
						<Button
							variant="ghost"
							className="text-blue-400 hover:text-blue-600 text-base px-5 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-100 hover:border-blue-500"
							onClick={() => window.open(project.url, "_blank")}
						>
							<ExternalLink className="w-5 h-5 mr-2" />
							Visit Website
						</Button>

						{/* View Code Button */}
						<Button
							variant="ghost"
							className="text-gray-400 hover:text-gray-600 text-base px-5 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 hover:border-gray-500"
							onClick={() => window.open(project.githubUrl, "_blank")}
						>
							<Github className="w-5 h-5 mr-2" />
							View Code
						</Button>

						{/* Download as ZIP Button */}
						<Button
							variant="ghost"
							className="text-green-400 hover:text-green-600 text-base px-5 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-100 hover:border-green-500"
							onClick={() => setZipModalOpen(true)} // Open modal on click
						>
							<Download className="w-5 h-5 mr-2" />
							Download as ZIP
						</Button>
					</div>

					{/* Social Media Share */}
					<div className="flex justify-center mt-4">
						{/* Share on Twitter (with the new X Icon) */}
						<Button
							variant="ghost"
							className="text-blue-500 hover:text-blue-700 text-base px-5 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-100 hover:border-blue-500"
							onClick={() => window.open(twitterShareUrl, "_blank")}
						>
							<XIcon className="w-5 h-5 mr-2" />
							Tweet
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* ZIP Modal */}
			{zipModalOpen && (
				<Dialog open={zipModalOpen} onOpenChange={setZipModalOpen}>
					<DialogContent className="bg-gradient-to-b from-[#1A1F2C] to-[#1A1F2C]/95 border border-[#8B5CF6]/20 backdrop-blur-xl text-white max-w-md p-6">
						<DialogHeader>
							<DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
								Coming Soon!
							</DialogTitle>
						</DialogHeader>
						<p className="text-lg text-gray-300">
							The "Download ZIP" feature is currently under development. Stay tuned for updates!
						</p>

						<div className="mt-6 flex justify-end gap-4">
							{/* Close Button */}
							<Button
								variant="outline"
								className="text-gray-400 hover:text-gray-600 text-base px-5 py-2 rounded-md"
								onClick={() => setZipModalOpen(false)}
							>
								Close
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};
