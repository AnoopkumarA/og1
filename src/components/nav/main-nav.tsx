import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { GithubIcon } from "lucide-react"

export function MainNav() {
	const supabase = createClientComponentClient()

	const handleGitHubSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'github',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`
				}
			})
			
			if (error) {
				console.error('Error signing in with GitHub:', error.message)
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4">
				<nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
					<Link
						href="/"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Home
					</Link>
				</nav>
				<div className="ml-auto flex items-center space-x-4">
					<Button 
						variant="outline" 
						onClick={handleGitHubSignIn}
						className="flex items-center gap-2"
					>
						<GithubIcon className="h-5 w-5" />
						Sign in with GitHub
					</Button>
				</div>
			</div>
		</div>
	)
}