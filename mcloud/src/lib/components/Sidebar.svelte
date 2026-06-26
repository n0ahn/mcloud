<script lang="ts">
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  async function logout() {
    await supabase.auth.signOut();
    goto("/login");
  }
</script>

<aside
  class="flex flex-col w-56 h-full bg-surface border-r border-surface-border px-3 py-6 shrink-0"
>
  <div class="flex items-center justify-center mb-8 px-2">
    <img src="/logo.png" alt="MCloud" class="h-9" />
  </div>

  <nav class="flex flex-col gap-1 flex-1">
    <a
      href="/dashboard"
      class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {$page
        .url.pathname === '/dashboard'
        ? 'bg-surface-border text-text-primary'
        : 'hover:bg-surface-border text-text-muted'}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="2" y="3" width="7" height="7" /><rect
          x="15"
          y="3"
          width="7"
          height="7"
        />
        <rect x="15" y="14" width="7" height="7" /><rect
          x="2"
          y="14"
          width="7"
          height="7"
        />
      </svg>
      Worlds
    </a>
    <a
      href="/settings"
      class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors {$page
        .url.pathname === '/settings'
        ? 'bg-surface-border text-text-primary font-medium'
        : 'hover:bg-surface-border text-text-muted'}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </svg>
      Settings
    </a>
  </nav>

  <button
    onclick={logout}
    class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-border text-text-muted text-sm transition-colors cursor-pointer w-full text-left"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
    Log out
  </button>
</aside>
