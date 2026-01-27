console.log('Initializing Supabase...');

if (!window.supabaseClient) {
    const SUPABASE_URL = 'https://oyaiyklvmzsxrxfnfhem.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_XwKjuzvmtNR2RuvmBqlL3w_dsK5_EbM';

    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        }
    );

    console.log('✅ Supabase client created successfully');
} else {
    console.log('✅ Supabase client already initialized');
}

// Helper function to insert data into Supabase
window.supabaseHelper = {
    async insertBehaviorData(data) {
        try {
            const supabase = window.supabaseClient;
            const { data: result, error } = await supabase
                .from('behavior_logs')
                .insert([data]);

            if (error) throw error;
            console.log('✅ Behavior data inserted:', result);
            return { success: true, result };
        } catch (error) {
            console.error('❌ Failed to insert behavior data:', error.message);
            return { success: false, error };
        }
    },

    async insertBehaviorFeatures(userId, features) {
        try {
            const supabase = window.supabaseClient;
            
            if (!userId) {
                throw new Error('User ID is required');
            }

            if (!features) {
                throw new Error('Features object is required');
            }

            console.log("📊 Inserting features for user:", userId, "Features:", features);

            const { data: result, error } = await supabase
                .from('behavior_features')
                .insert([{
                    user_id: userId,
                    avg_mouse_speed: features.avg_mouse_speed || 0,
                    mouse_move_variance: features.mouse_move_variance || 0,
                    typing_speed: features.typing_speed || 0,
                    backspace_ratio: features.backspace_ratio || 0,
                    scroll_frequency: features.scroll_frequency || 0,
                    focus_ratio: features.focus_ratio || 0,
                    idle_ratio: features.idle_ratio || 0,
                    window_duration: features.window_duration || 0
                }]);

            if (error) throw error;
            
            console.log('✅ Behavior features inserted:', result);
            return { success: true, result };
        } catch (error) {
            console.error('❌ Failed to insert behavior features:', error.message);
            return { success: false, error };
        }
    },

    async insertResearchNotes(notes, userId) {
        try {
            const supabase = window.supabaseClient;
            const { data: result, error } = await supabase
                .from('research_notes')
                .insert([{
                    user_id: userId,
                    content: notes,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);

            if (error) throw error;
            console.log('✅ Research notes saved:', result);
            return { success: true, result };
        } catch (error) {
            console.error('❌ Failed to save research notes:', error.message);
            return { success: false, error };
        }
    },

    async getUserId() {
        try {
            const supabase = window.supabaseClient;
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
                console.warn('⚠️ No active session');
                return null;
            }
            
            console.log('✅ User ID retrieved:', session.user.id);
            return session.user.id;
        } catch (error) {
            console.error('❌ Error getting user ID:', error);
            return null;
        }
    }
};