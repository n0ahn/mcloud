#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![zip_folder, unzip_file, open_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs::File;
use std::path::Path;
use walkdir::WalkDir;
use zip::write::FileOptions;
use zip::ZipWriter;

#[tauri::command]
fn zip_folder(source_path: String, output_path: String) -> Result<(), String> {
    let path = Path::new(&source_path);
    let file = File::create(&output_path).map_err(|e| e.to_string())?;
    let mut zip = ZipWriter::new(file);
    let options = FileOptions::default().compression_method(zip::CompressionMethod::Deflated);

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        let entry_path = entry.path();
        let name = entry_path.strip_prefix(path).map_err(|e| e.to_string())?;

        if entry_path.is_file() {
            zip.start_file(name.to_string_lossy(), options)
                .map_err(|e| e.to_string())?;
            let mut f = File::open(entry_path).map_err(|e| e.to_string())?;
            std::io::copy(&mut f, &mut zip).map_err(|e| e.to_string())?;
        }
    }

    zip.finish().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn unzip_file(zip_path: String, output_path: String) -> Result<(), String> {
    let file = std::fs::File::open(&zip_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;
    archive.extract(&output_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn open_app(app_name: String) -> Result<(), String> {
    std::process::Command::new("open")
        .args(["-a", &app_name])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}
