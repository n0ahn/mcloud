<script lang="ts">
  import { supabase } from '$lib/supabase'
  import { onMount } from 'svelte'

  import Sidebar from '$lib/components/Sidebar.svelte'
  import WorldCard from '$lib/components/WorldCard.svelte'
  import AddWorldModal from '$lib/components/AddWorldModal.svelte'

  let worlds = $state<any[]>([])
  let showModal = $state(false)
  let loading = $state(true)

  async function fetchWorlds() {
    loading = true
    const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) { console.error(error); loading = false; return }
    worlds = data
    loading = false
  }

  onMount(fetchWorlds)
</script>

<div class="flex w-full h-screen bg-bg-primary text-text-primary">

  <Sidebar />

  <main class="flex flex-col flex-1 p-8 overflow-y-auto">

    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">My Worlds</h1>
        <p class="text-text-muted text-sm mt-1">Manage and play your Minecraft worlds</p>
      </div>
      <button onclick={() => showModal = true} class="flex items-center gap-2 bg-green hover:bg-green-dark text-bg-primary font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add world
      </button>
    </div>

    {#if loading}
      <!-- Skeleton loader -->
      <div class="grid grid-cols-3 gap-4">
        {#each [1, 2, 3] as _}
          <div class="flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden animate-pulse">
            <div class="w-full h-32 bg-surface-border"></div>
            <div class="p-4 flex flex-col gap-3">
              <div class="h-4 bg-surface-border rounded w-2/3"></div>
              <div class="h-3 bg-surface-border rounded w-1/3"></div>
              <div class="flex gap-2">
                <div class="flex-1 h-8 bg-surface-border rounded-lg"></div>
                <div class="w-16 h-8 bg-surface-border rounded-lg"></div>
                <div class="w-8 h-8 bg-surface-border rounded-lg"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>

    {:else if worlds.length === 0}
      <!-- Lege staat -->
      <div class="flex flex-col items-center justify-center flex-1 gap-4 text-center">
        <div class="w-20 h-20 rounded-2xl bg-surface border border-surface-border flex items-center justify-center">
          <svg viewBox="0 0 64 64" class="w-12 h-12 opacity-30" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="16" height="16" fill="#5a8a3c"/>
            <rect x="16" y="0" width="16" height="16" fill="#4a7a2c"/>
            <rect x="32" y="0" width="16" height="16" fill="#6a9a4c"/>
            <rect x="48" y="0" width="16" height="16" fill="#5a8a3c"/>
            <rect x="0" y="16" width="16" height="16" fill="#8B6914"/>
            <rect x="16" y="16" width="16" height="16" fill="#7a5a10"/>
            <rect x="32" y="16" width="16" height="16" fill="#8B6914"/>
            <rect x="48" y="16" width="16" height="16" fill="#7a5a10"/>
          </svg>
        </div>
        <div>
          <p class="text-text-primary font-semibold text-lg">No worlds yet</p>
          <p class="text-text-muted text-sm mt-1">Add your first world to get started</p>
        </div>
        <button
          onclick={() => showModal = true}
          class="flex items-center gap-2 bg-green hover:bg-green-dark text-bg-primary font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer mt-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add world
        </button>
      </div>

    {:else}
      <div class="grid grid-cols-3 gap-4">
        {#each worlds as world}
          <WorldCard {...world} worldPath={world.path} ondelete={fetchWorlds} />
        {/each}
      </div>
    {/if}

  </main>
</div>

{#if showModal}
  <AddWorldModal onclose={() => showModal = false} onadd={fetchWorlds} />
{/if}