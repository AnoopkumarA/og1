import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { GithubIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserNav() {
	const supabase = createClientComponentClient()
	const router = useRouter()

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
		<div className="flex items-center gap-4">
			<Button 
				variant="outline" 
				onClick={handleGitHubSignIn}
				className="px-3 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1 lg:px-4 lg:py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full flex items-center gap-2"
			>
				<GithubIcon className="h-5 w-5" />
				Sign in with GitHub
			</Button>
		</div>
	)
}