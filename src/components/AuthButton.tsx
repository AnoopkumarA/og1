import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { Github, LogOut } from "lucide-react";

export const AuthButton = () => {
  const { user, signOut } = useSupabase();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };

  return user ? (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/20">
          <span className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
            {user.email}
          </span>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          onClick={signOut}
          variant="outline"
          className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full"
        >
          <LogOut className="w-4 h-4 text-[#8B5CF6]" />
          Sign Out
        </Button>
      </div>
    </div>
  ) : (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
      <Button
        onClick={handleSignIn}
        variant="outline"
        className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full"
      >
        <Github className="h-4 w-4 sm:h-5 sm:w-5" />
        Sign in with GitHub
      </Button>
    </div>
  );
};