import { goto } from '$app/navigation'
import { supabase } from '$lib/supabase'
import { browser } from '$app/environment'
import { loadSettings } from '$lib/stores/settings'

export async function load() {
  if (!browser) return {}
  await loadSettings()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    goto('/login')
  }

  return { session }
}