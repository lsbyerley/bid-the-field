import { supabaseClient } from '@supabase/auth-helpers-nextjs';

export default function SignIn() {
  return (
    <div className='max-w-2xl mx-auto'>
      <div className='flex items-center justify-center px-8 py-8 mt-4 rounded bg-content bg-base-200'>
        <div>
          <button
            className='btn'
            onClick={() => supabaseClient.auth.signIn({ provider: 'google' })}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
