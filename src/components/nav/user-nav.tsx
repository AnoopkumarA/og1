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
				className="flex items-center gap-2"
			>
				<GithubIcon className="h-5 w-5" />
				Sign in with GitHub
			</Button>
		</div>
	)
}