import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function saveSession({ tab, mode, firstCorrect, corrections, finalScore, total }) {
  const { error } = await supabase.from('sessions').insert({
    tab,
    mode,
    first_correct: firstCorrect,
    corrections,
    final_score: finalScore,
    total,
  })
  if (error) console.error('Supabase error:', error)
}
