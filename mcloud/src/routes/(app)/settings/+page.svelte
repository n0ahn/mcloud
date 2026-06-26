<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { supabase } from "$lib/supabase";
    import { onMount } from "svelte";
    import { settings, saveSettings, defaultPaths } from "$lib/stores/settings";
    import { goto } from '$app/navigation'

    let username = $state("");
    let os = $state<"macos" | "windows">($settings.os);
    let launcherPaths = $state<Record<string, string>>({
        ...$settings.launcher_paths,
    });
    let saved = $state(false);

    function switchOS(newOS: "macos" | "windows") {
        os = newOS;
        launcherPaths = { ...defaultPaths[newOS] };
    }
    async function logout() {
        await supabase.auth.signOut();
        goto("/login");
    }

    onMount(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            username = user.user_metadata?.username || user.email || "";
        }
    });

    async function save() {
        await saveSettings({ os, launcher_paths: launcherPaths });
        saved = true;
        setTimeout(() => (saved = false), 2000);
    }
</script>

<div class="flex w-full h-screen bg-bg-primary text-text-primary">
    <Sidebar />

    <main class="flex flex-col flex-1 p-8 overflow-y-auto">
        <div class="mb-8">
            <h1 class="text-2xl font-bold">Settings</h1>
            <p class="text-text-muted text-sm mt-1">
                Manage your account and launcher paths
            </p>
        </div>

        <div class="flex flex-col gap-6 max-w-2xl">
            <!-- Account -->
            <div
                class="bg-surface border border-surface-border rounded-xl p-6 flex flex-col gap-4"
            >
                <h2 class="text-base font-semibold">Account</h2>
                <div class="flex flex-col gap-1.5">
                    <label for="username" class="text-text-muted text-sm"
                        >Username</label
                    >
                    <input
                        bind:value={username}
                        type="text"
                        class="h-11 rounded-lg bg-bg-primary border border-surface-border px-4 text-text-primary text-sm focus:outline-none focus:border-green"
                    />
                </div>
            </div>

            <!-- OS Switch -->
            <div
                class="bg-surface border border-surface-border rounded-xl p-6 flex flex-col gap-4"
            >
                <h2 class="text-base font-semibold">Operating System</h2>
                <p class="text-text-muted text-sm -mt-2">
                    Switch to load default launcher paths for your OS
                </p>
                <div class="flex gap-2">
                    <button
                        onclick={() => switchOS("macos")}
                        class="flex-1 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer {os ===
                        'macos'
                            ? 'bg-green text-bg-primary'
                            : 'bg-bg-primary border border-surface-border text-text-muted hover:border-green'}"
                    >
                        macOS
                    </button>
                    <button
                        onclick={() => switchOS("windows")}
                        class="flex-1 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer {os ===
                        'windows'
                            ? 'bg-green text-bg-primary'
                            : 'bg-bg-primary border border-surface-border text-text-muted hover:border-green'}"
                    >
                        Windows
                    </button>
                </div>
            </div>

            <!-- Launcher Paths -->
            <div
                class="bg-surface border border-surface-border rounded-xl p-6 flex flex-col gap-4"
            >
                <div>
                    <h2 class="text-base font-semibold">Launcher Paths</h2>
                    <p class="text-text-muted text-sm mt-1">
                        Override the default save locations per launcher
                    </p>
                </div>
                <div class="flex flex-col gap-3">
                    {#each Object.entries(launcherPaths) as [launcher, path]}
                        <div class="flex flex-col gap-1.5">
                            <label
                                for={launcher}
                                class="text-text-muted text-sm"
                                >{launcher}</label
                            >
                            <input
                                id={launcher}
                                value={path}
                                oninput={(e) =>
                                    (launcherPaths[launcher] = (
                                        e.target as HTMLInputElement
                                    ).value)}
                                type="text"
                                class="h-11 rounded-lg bg-bg-primary border border-surface-border px-4 text-text-primary text-sm focus:outline-none focus:border-green font-mono"
                            />
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Save -->
            <button
                onclick={save}
                class="h-11 rounded-lg bg-green hover:bg-green-dark text-bg-primary font-semibold text-sm transition-colors cursor-pointer"
            >
                {#if saved}
                    ✓ Saved!
                {:else}
                    Save settings
                {/if}
            </button>
            <button
                onclick={logout}
                class="w-full h-11 rounded-lg bg-bg-primary border border-surface-border text-text-muted text-sm hover:bg-surface-border transition-colors cursor-pointer"
            >
                Log out
            </button>
        </div>
    </main>
</div>
