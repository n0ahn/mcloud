<script lang="ts">
  import { playWorld } from "$lib/play";
  import { uploadWorld } from "$lib/upload";
  import { supabase } from "$lib/supabase";
  import { ask } from '@tauri-apps/plugin-dialog'


  let { name, launcher, created_at, id, worldPath, ondelete } = $props<{
    name: string;
    launcher: string;
    created_at: string;
    id: string;
    worldPath: string;
    ondelete: () => void;
  }>();

  let error = $state("");
  let playing = $state(false);
  let syncing = $state(false);
  let deleting = $state(false);

  async function handlePlay() {
    error = "";
    playing = true;
    try {
      await playWorld(id, name, launcher);
    } catch (err) {
      error = "Failed to launch world";
      console.error("Play failed:", err);
    }
    playing = false;
  }

  async function handleSync() {
    error = "";
    syncing = true;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await uploadWorld(id, worldPath, user.id);
    } catch (err) {
      error = "Sync failed";
      console.error("Sync failed:", err);
    }
    syncing = false;
  }

  async function handleDelete() {
    const confirmed = await ask("Are you sure you want to delete this world?", {
      title: "Delete world",
      kind: "warning",
    });
    if (!confirmed) return;

    deleting = true;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await fetch('https://mcloud-nk0a.onrender.com/upload/world', {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldId: id, userId: user.id }),
      });
      await supabase.from("worlds").delete().eq("id", id);
      ondelete();
    } catch (err) {
      console.error("Delete failed:", err);
    }
    deleting = false;
  }
</script>

<div
  class="flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden hover:border-green transition-all duration-200 group"
>
  <!-- Thumbnail -->
  <div
    class="relative w-full h-44 bg-bg-primary flex items-center justify-center border-b border-surface-border"
  >
    <svg
      viewBox="0 0 64 64"
      class="w-20 h-20 opacity-40 group-hover:opacity-70 transition-opacity"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="16" height="16" fill="#5a8a3c" />
      <rect x="16" y="0" width="16" height="16" fill="#4a7a2c" />
      <rect x="32" y="0" width="16" height="16" fill="#6a9a4c" />
      <rect x="48" y="0" width="16" height="16" fill="#5a8a3c" />
      <rect x="0" y="16" width="16" height="16" fill="#4a7a2c" />
      <rect x="16" y="16" width="16" height="16" fill="#8B6914" />
      <rect x="32" y="16" width="16" height="16" fill="#7a5a10" />
      <rect x="48" y="16" width="16" height="16" fill="#8B6914" />
      <rect x="0" y="32" width="16" height="16" fill="#7a5a10" />
      <rect x="16" y="32" width="16" height="16" fill="#8B6914" />
      <rect x="32" y="32" width="16" height="16" fill="#6a4a0c" />
      <rect x="48" y="32" width="16" height="16" fill="#7a5a10" />
      <rect x="0" y="48" width="16" height="16" fill="#8B6914" />
      <rect x="16" y="48" width="16" height="16" fill="#6a4a0c" />
      <rect x="32" y="48" width="16" height="16" fill="#7a5a10" />
      <rect x="48" y="48" width="16" height="16" fill="#8B6914" />
    </svg>
    <span
      class="absolute top-3 right-3 text-xs text-text-muted bg-bg-primary border border-surface-border px-2.5 py-1 rounded-md"
    >
      {launcher}
    </span>
  </div>

  <!-- Info -->
  <div class="flex flex-col p-5 gap-4">
    <div>
      <p class="font-semibold text-text-primary">{name}</p>
      <p class="text-text-muted text-xs mt-1">
        Added {new Date(created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>

    {#if error}
      <p class="text-red-400 text-xs -mt-1">{error}</p>
    {/if}

    <div class="flex gap-2">
      <button
        onclick={handlePlay}
        disabled={playing}
        class="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg bg-green hover:bg-green-dark text-bg-primary font-semibold transition-colors cursor-pointer disabled:opacity-60"
      >
        {#if playing}
          <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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
          Loading...
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Play
        {/if}
      </button>

      <button
        onclick={handleSync}
        disabled={syncing}
        class="flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-lg bg-bg-primary hover:bg-surface-border text-text-muted transition-colors cursor-pointer border border-surface-border disabled:opacity-60"
      >
        {#if syncing}
          <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="16 16 12 20 8 16" />
            <line x1="12" y1="20" x2="12" y2="4" />
          </svg>
        {/if}
        Sync
      </button>

      <button
        onclick={handleDelete}
        disabled={deleting}
        class="flex items-center justify-center px-3 py-2.5 rounded-lg bg-bg-primary hover:bg-red-900/30 text-text-muted hover:text-red-400 transition-colors cursor-pointer border border-surface-border disabled:opacity-60"
      >
        {#if deleting}
          <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</div>
