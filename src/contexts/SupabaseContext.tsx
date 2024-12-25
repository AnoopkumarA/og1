import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type SupabaseContextType = {
	user: User | null
	loading: boolean
	signOut: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

function useSupabase() {
	const context = useContext(SupabaseContext)
	if (context === undefined) {
		throw new Error('useSupabase must be used within a SupabaseProvider')
	}
	return context
}

function SupabaseProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		return () => subscription.unsubscribe()
	}, [])

	const signOut = async () => {
		await supabase.auth.signOut()
	}

	return (
		<SupabaseContext.Provider value={{ user, loading, signOut }}>
			{children}
		</SupabaseContext.Provider>
	)
}

export { SupabaseProvider, useSupabase }
