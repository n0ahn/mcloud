import { invoke } from '@tauri-apps/api/core'
import { tempDir } from '@tauri-apps/api/path'
import { readFile } from '@tauri-apps/plugin-fs'


export async function uploadWorld(worldId: string, worldPath: string, userId: string) {
    const temp = await tempDir()
    const zipPath = `${temp}/${worldId}.zip`

    await invoke('zip_folder', {
        sourcePath: worldPath,
        outputPath: zipPath
    })

    console.log('Zip created at:', zipPath)

    const bytes = await readFile(zipPath)
    const blob = new Blob([bytes], { type: 'application/zip' })

    const formData = new FormData()
    formData.append('file', blob, `${worldId}.zip`)
    formData.append('worldId', worldId)
    formData.append('userId', userId)

    console.log('Sending to API...')

    const response = await fetch('https://mcloud-nk0a.onrender.com/upload/world', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error(await response.text())
    }
}