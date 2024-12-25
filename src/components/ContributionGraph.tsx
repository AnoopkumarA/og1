import React, { useState } from 'react';
import { Project } from '@/types/project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContributionGraphProps {
	projects: Project[];
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ projects }) => {
	const getContributionColor = (count: number): string => {
		const colors = [
            'bg-green-300 dark:from-emerald-500 dark:to-emerald-400',
			'bg-green-800 dark:from-emerald-700 dark:to-emerald-600',
            'bg-green-700 dark:from-emerald-700 dark:to-emerald-600',
            'bg-green-600 dark:from-emerald-700 dark:to-emerald-600',
			'bg-green-400 dark:from-emerald-600 dark:to-emerald-500',
            'bg-[#90EE90] dark:from-emerald-600 dark:to-emerald-500',
            'bg-green-500 dark:from-emerald-600 dark:to-emerald-500',
			' bg-[#FFD700] dark:from-emerald-500 dark:to-emerald-400'
		];
		return colors[Math.min(count - 1, colors.length - 1)] || colors[0];
	};

	// Group projects by date and count
	const projectsByDate = projects.reduce((acc, project) => {
		try {
			if (!project.createdAt) return acc;
			
			const date = new Date(project.createdAt);
			if (isNaN(date.getTime())) return acc; // Skip invalid dates
			
			const dateStr = date.toISOString().split('T')[0];
			acc[dateStr] = (acc[dateStr] || 0) + 1;
		} catch (error) {
			console.error('Error processing date:', error);
		}
		return acc;
	}, {} as Record<string, number>);

	const [selectedYear, setSelectedYear] = useState(() => {
		const currentYear = new Date().getFullYear().toString();
		return currentYear;
	});

	const generateCalendarDates = (year: string) => {
		const dates = [];
		const today = new Date();
		const startDate = new Date(`${year}-01-01`);
		const endDate = year === today.getFullYear().toString() 
			? today 
			: new Date(`${year}-12-31`);

		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toISOString().split('T')[0];
			dates.push(dateStr);
		}
		return dates;
	};

	const yearDates = {
		"2024": generateCalendarDates("2024"),
		"2025": generateCalendarDates("2025")
	};

	return (
		<div className="p-4  bg-black  dark:bg-gray-900/50 backdrop-blur-lg rounded-lg shadow-2xl border border-purple-900">
			<h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent font-display">
				Project Contributions
			</h3>
			<Tabs defaultValue={selectedYear} className="w-full" onValueChange={setSelectedYear}>
				<TabsList className="mb-3">
					<TabsTrigger value="2024" className="px-3 py-2 text-sm">2024</TabsTrigger>
					<TabsTrigger value="2025" className="px-3 py-2 text-sm">2025</TabsTrigger>
				</TabsList>

				<div className="flex flex-wrap gap-1.5 mb-4">
					{yearDates[selectedYear as keyof typeof yearDates].map((date) => (
					<div
						key={date}
						className={`w-4 h-4 rounded ${projectsByDate[date] ? getContributionColor(projectsByDate[date]) : ' bg-gray-800 dark:bg-gray-800'} 
						shadow-sm transition-all duration-300 hover:scale-110 cursor-pointer
						border border-emerald-100/20 dark:border-emerald-900/20`}
						title={projectsByDate[date] ? 
							`${projectsByDate[date]} project${projectsByDate[date] > 1 ? 's' : ''} on ${new Date(date).toLocaleDateString()}` :
							`No projects on ${new Date(date).toLocaleDateString()}`}
					/>
				))}
				{projects.length === 0 && (
					<div className="text-base text-gray-400 dark:text-gray-500 font-medium italic">
						No projects added yet
					</div>
				)}
			</div>
			</Tabs>
			<div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
				<span className="font-medium">Contribution Levels:</span>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						<div className="w-4 h-4 rounded bg-green-200 dark:from-emerald-900 dark:to-emerald-800 
						border border-emerald-100/20 dark:border-emerald-900/20 shadow-sm" />
						<span>1 Project</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-300 to-emerald-400 dark:from-emerald-700 dark:to-emerald-600 
						border border-emerald-100/20 dark:border-emerald-900/20 shadow-sm" />
						<span>2 Projects</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-4 h-4 rounded bg-green-500 dark:from-emerald-500 dark:to-emerald-400 
						border border-emerald-100/20 dark:border-emerald-900/20 shadow-sm" />
						<span>3+ Projects</span>
					</div>
                    <div className="flex items-center gap-1">
						<div className="w-4 h-4 rounded bg-[#FFD700] dark:from-emerald-500 dark:to-emerald-400 
						border border-emerald-100/20 dark:border-emerald-900/20 shadow-sm" />
						<span>8+ Projects</span>
					</div>
				</div>
			</div>
		</div>
	);
};