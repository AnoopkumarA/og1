import { createClient } from '@supabase/supabase-js'

// Access environment variables directly
const supabaseUrl = 'https://mfoswzttcgzplvnderoy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb3N3enR0Y2d6cGx2bmRlcm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MDM5OTEsImV4cCI6MjA1MDM3OTk5MX0.o8bc6_tBr7YGG0N6W6v3qI4CPYzIemE5SCvg-TCBkW8'

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase configuration')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true
	}
})

