import { invoke } from '@tauri-apps/api/core'
import { tempDir, homeDir } from '@tauri-apps/api/path'
import { writeFile } from '@tauri-apps/plugin-fs'
import { supabase } from '$lib/supabase'
import { get } from 'svelte/store'
import { settings } from '$lib/stores/settings'

const launcherApps: Record<string, string> = {
  'Modrinth': 'Modrinth App',
  'Lunar Client': 'Lunar Client',
  'Feather': 'Feather',
  'CurseForge': 'CurseForge',
  'ATLauncher': 'ATLauncher',
  'Prism': 'Prism Launcher',
  'Vanilla': 'Minecraft',
}

export async function playWorld(worldId: string, worldName: string, launcher: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const response = await fetch('https://mcloud-nk0a.onrender.com/upload/world', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worldId, userId: user.id })
  })
  const { url } = await response.json()

  const temp = await tempDir()
  const zipPath = `${temp}/${worldId}.zip`

  const zipResponse = await fetch(url)
  const bytes = new Uint8Array(await zipResponse.arrayBuffer())
  await writeFile(zipPath, bytes)

  const home = await homeDir()
  const currentSettings = get(settings)
  const launcherPath = currentSettings.launcher_paths[launcher]
  const savesPath = `${home}/${launcherPath}`

  await invoke('unzip_file', {
    zipPath,
    outputPath: `${savesPath}/${worldName}`
  })

  const app = launcherApps[launcher]
  if (app) {
    await invoke('open_app', { appName: app })
  }
}