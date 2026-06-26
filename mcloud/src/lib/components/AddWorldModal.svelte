<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { open } from "@tauri-apps/plugin-dialog";
    import { homeDir } from "@tauri-apps/api/path";
    import { uploadWorld } from "$lib/upload";
    import { get } from 'svelte/store'
    import { settings } from '$lib/stores/settings'

    const launchers = [
        "Modrinth",
        "Lunar Client",
        "Feather",
        "CurseForge",
        "ATLauncher",
        "Prism",
        "Vanilla",
    ];

    let worldName = $state("");
    let selectedLauncher = $state("");
    let worldPath = $state("");
    let selectedFolder = $state("");
    let dropdownOpen = $state(false);
    let loading = $state(false);

    const { onclose, onadd } = $props<{
        onclose: () => void;
        onadd: () => void;
    }>();

    async function onLauncherSelect(launcher: string) {
        selectedLauncher = launcher;
        dropdownOpen = false;

        const home = await homeDir();
        const currentSettings = get(settings)
        const path = currentSettings.launcher_paths[launcher];
        if (path) {
            worldPath = `${home}/${path}`;
        }
    }

    async function browse() {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Select your world folder",
            defaultPath: worldPath || (await homeDir()),
        });

        if (selected) {
            worldPath = selected;
            selectedFolder = selected.split("/").pop() || "";
            worldName = worldName || selectedFolder;
        }
    }

    async function addWorld() {
        if (!worldName || !selectedLauncher || !worldPath) return;

        loading = true;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { loading = false; return; }

        const { data, error } = await supabase
            .from("worlds")
            .insert({
                user_id: user.id,
                name: worldName,
                launcher: selectedLauncher,
                path: worldPath,
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            loading = false;
            return;
        }

        try {
            await uploadWorld(data.id, worldPath, user.id);
        } catch (err) {
            console.error("Upload failed:", err);
            loading = false;
            return;
        }

        loading = false;
        onadd();
        onclose();
    }
</script>

<div
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    onclick={onclose}
    role="presentation"
    onkeydown={onclose}
>
    <div
        class="bg-surface border border-surface-border rounded-2xl p-8 w-120 flex flex-col gap-6"
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        onkeydown={(e) => e.stopPropagation()}
        tabindex="0"
    >
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-text-primary">Add world</h2>
            <button
                onclick={onclose}
                aria-label="Close modal"
                class="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="18" y1="6" x2="6" y2="18" /><line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                    />
                </svg>
            </button>
        </div>

        <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
                <label for="worldName" class="text-text-muted text-sm"
                    >World name</label
                >
                <input
                    id="worldName"
                    bind:value={worldName}
                    type="text"
                    placeholder="My awesome world"
                    class="h-11 rounded-lg bg-bg-primary border border-surface-border px-4 text-text-primary text-sm focus:outline-none focus:border-green"
                />
            </div>

            <div class="flex flex-col gap-2">
                <label for="launcher" class="text-text-muted text-sm"
                    >Launcher</label
                >
                <div class="relative">
                    <button
                        id="launcher"
                        type="button"
                        onclick={() => (dropdownOpen = !dropdownOpen)}
                        class="w-full h-11 rounded-lg bg-bg-primary border border-surface-border px-4 text-sm flex items-center justify-between cursor-pointer transition-colors {selectedLauncher
                            ? 'text-text-primary'
                            : 'text-text-muted'} {dropdownOpen
                            ? 'border-green'
                            : ''}"
                    >
                        {selectedLauncher || "Select a launcher..."}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 text-text-muted transition-transform {dropdownOpen
                                ? 'rotate-180'
                                : ''}"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {#if dropdownOpen}
                        <div
                            class="absolute top-12 left-0 w-full bg-surface border border-surface-border rounded-lg overflow-hidden z-10"
                        >
                            {#each launchers as launcher}
                                <button
                                    type="button"
                                    onclick={() => onLauncherSelect(launcher)}
                                    class="w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer {selectedLauncher ===
                                    launcher
                                        ? 'text-green bg-bg-primary'
                                        : 'text-text-primary hover:bg-bg-primary'}"
                                >
                                    {launcher}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label for="worldPath" class="text-text-muted text-sm"
                    >World folder</label
                >
                <div class="flex gap-2">
                    <input
                        id="worldPath"
                        value={selectedFolder}
                        type="text"
                        placeholder="No folder selected"
                        readonly
                        class="flex-1 h-11 rounded-lg bg-bg-primary border border-surface-border px-4 text-text-primary text-sm focus:outline-none cursor-default"
                    />
                    <button
                        class="h-11 px-4 rounded-lg bg-surface-border hover:bg-surface text-text-primary text-sm transition-colors cursor-pointer border border-surface-border"
                        onclick={browse}
                    >
                        Browse
                    </button>
                </div>
            </div>
        </div>

        <div class="flex gap-3 mt-2">
            <button
                onclick={onclose}
                class="flex-1 h-11 rounded-lg bg-bg-primary border border-surface-border text-text-muted text-sm hover:bg-surface-border transition-colors cursor-pointer"
            >
                Cancel
            </button>
            <button
                class="flex-1 h-11 rounded-lg bg-green hover:bg-green-dark text-bg-primary font-semibold text-sm transition-colors cursor-pointer"
                onclick={addWorld}
            >
                {#if loading}
                    <div class="flex items-center justify-center gap-2">
                        <svg
                            class="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                        Adding...
                    </div>
                {:else}
                    Add world
                {/if}
            </button>
        </div>
    </div>
</div>
