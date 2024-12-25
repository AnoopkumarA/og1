import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "./ui/button";
import { Github, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Header = () => {
	const { user, signOut } = useSupabase();

	const handleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: window.location.origin
			}
		});
		if (error) console.error('Error:', error.message);
	};

	return (
		<header className="w-full border-b border-[#8B5CF6]/20 backdrop-blur-xl">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
					Showcase Space
				</h1>
				{user ? (
					<div className="flex items-center gap-4">
						<span className="text-white">{user.email}</span>
						<Button
							onClick={signOut}
							variant="outline"
							className="border-[#8B5CF6]/20 text-white hover:bg-[#8B5CF6]/20"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Sign Out
						</Button>
					</div>
				) : (
					<Button
						onClick={handleSignIn}
						className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white"
					>
						<Github className="w-5 h-5 mr-2" />
						Sign in with GitHub
					</Button>
				)}
			</div>
		</header>
	);
};

