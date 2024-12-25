import { supabase } from './supabase';
import { Project } from '@/types/project';

export const projectsService = {
	async getProjects(): Promise<Project[]> {
		const { data, error } = await supabase
			.from('projects')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching projects:', error);
			throw error;
		}

		return data?.map(item => ({
			id: item.id,
			title: item.title,
			description: item.description,
			type: item.type,
			url: item.url,
			imageUrl: item.image_url,
			tags: item.tags,
			createdAt: item.created_at,
			category: item.type
		})) || [];
	},

	async addProject(projectData: Partial<Project>): Promise<Project> {
		const { data, error } = await supabase
			.from('projects')
			.insert([{
				title: projectData.title,
				description: projectData.description,
				type: projectData.type,
				url: projectData.url,
				image_url: projectData.imageUrl,
				tags: projectData.tags,
				created_at: new Date().toISOString(),
				category: projectData.type
			}])
			.select()
			.single();

		if (error) {
			console.error('Error adding project:', error);
			throw error;
		}

		if (!data) {
			throw new Error('No data returned from database');
		}

		return {
			id: data.id,
			title: data.title,
			description: data.description,
			type: data.type,
			url: data.url,
			imageUrl: data.image_url,
			tags: data.tags,
			createdAt: data.created_at,
			category: data.type
		};
