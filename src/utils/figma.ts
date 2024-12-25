export const isFigmaUrl = (url: string): boolean => {
	return url.includes('figma.com/');
};

export const getFigmaFileKey = (url: string): string | null => {
	// Handle community files
	if (url.includes('figma.com/community/file/')) {
		const match = url.match(/figma\.com\/community\/file\/([^/]+)/);
		return match ? match[1] : null;
	}
	// Handle regular files
	const match = url.match(/figma\.com\/file\/([^/]+)/);
	return match ? match[1] : null;
};

export const getFigmaThumbnailUrl = (fileKey: string): string => {
	// For community files, we use a different URL format
	return `https://www.figma.com/community/file/${fileKey}/thumbnail`;
};

export const getFigmaPreviewUrl = async (url: string): Promise<string | null> => {
	const fileKey = getFigmaFileKey(url);
	if (!fileKey) return null;
	
	if (url.includes('figma.com/community/file/')) {
		return `https://www.figma.com/community/file/${fileKey}/thumbnail`;
	}
	return `https://www.figma.com/file/${fileKey}/thumbnail`;
};