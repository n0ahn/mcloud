import { writable } from 'svelte/store'
import { supabase } from '$lib/supabase'

export const defaultPaths = {
  macos: {
    'Modrinth': 'Library/Application Support/ModrinthApp/profiles/default/saves',
    'Lunar Client': '.lunarclient/offline/multiver/saves',
    'Feather': 'Library/Application Support/feather/instances',
    'CurseForge': 'curseforge/minecraft/Instances',
    'ATLauncher': 'Library/Application Support/ATLauncher/instances',
    'Prism': 'Library/Application Support/PrismLauncher/instances',
    'Vanilla': 'Library/Application Support/minecraft/saves',
  },
  windows: {
    'Modrinth': 'AppData\\Roaming\\ModrinthApp\\profiles\\default\\saves',
    'Lunar Client': '.lunarclient\\offline\\multiver\\saves',
    'Feather': 'AppData\\Roaming\\feather\\instances',
    'CurseForge': 'curseforge\\minecraft\\Instances',
    'ATLauncher': 'AppData\\Roaming\\ATLauncher\\instances',
    'Prism': 'AppData\\Roaming\\PrismLauncher\\instances',
    'Vanilla': 'AppData\\Roaming\\.minecraft\\saves',
  }
}

export type Settings = {
  os: 'macos' | 'windows'
  launcher_paths: Record<string, string>
}

export const settings = writable<Settings>({
  os: 'macos',
  launcher_paths: { ...defaultPaths.macos }
})

export async function loadSettings() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (data) {
    settings.set({
      os: data.os,
      launcher_paths: Object.keys(data.launcher_paths).length > 0
        ? data.launcher_paths
        : { ...defaultPaths[data.os as 'macos' | 'windows'] }
    })
  }
}

export async function saveSettings(newSettings: Settings) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('settings').upsert({
    user_id: user.id,
    os: newSettings.os,
    launcher_paths: newSettings.launcher_paths,
  }, { onConflict: 'user_id' })

  settings.set(newSettings)
}