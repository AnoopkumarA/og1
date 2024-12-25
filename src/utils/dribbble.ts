export const isDribbbleUrl = (url: string): boolean => {
	return url.includes('dribbble.com/shots/');
};

export const getDribbbleId = (url: string): string | null => {
	// Handle both clean and UTM-tagged URLs
	const match = url.match(/dribbble\.com\/shots\/(\d+)(?:\-[\w-]+)?/);
	return match ? match[1] : null;
};

export const getDribbbleImageUrl = (url: string): string | null => {
	const shotId = getDribbbleId(url);
	if (!shotId) return null;

	// Dribbble's CDN URL pattern for shot images
	return `https://cdn.dribbble.com/userupload/shots/${shotId}/large`;
};
