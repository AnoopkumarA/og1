// Add your YouTube API key here
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';

export const getYouTubeVideoId = (url: string): string | null => {
	const patterns = [
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/,
		/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) return match[1];
	}
	return null;
};

export const getYouTubeThumbnailUrl = (videoId: string): string => {
	return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const isYouTubeUrl = (url: string): boolean => {
	return getYouTubeVideoId(url) !== null;
};
