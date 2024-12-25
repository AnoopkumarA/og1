import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSupabase } from '@/contexts/SupabaseContext';

export const UserCount = () => {
  const [userCount, setUserCount] = useState(0);
  const { user } = useSupabase();

  useEffect(() => {
    if (!user) return; // Only track if user is authenticated

    // Subscribe to the presence channel
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id, // Use GitHub user ID as the key instead of random UUID
        },
      },
    });

    // Track online users
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        // Count unique user IDs
        const uniqueUsers = new Set(Object.keys(presenceState));
        setUserCount(uniqueUsers.size);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            github_username: user.user_metadata.user_name,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]); // Add user as dependency

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex items-center justify-center gap-2 mt-4 text-gray-400"
    >
      <Users className="w-5 h-5" />
      <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] text-transparent bg-clip-text">
        {userCount} {userCount === 1 ? 'developer' : 'developers'} online
      </span>
    </motion.div>
  );
};
