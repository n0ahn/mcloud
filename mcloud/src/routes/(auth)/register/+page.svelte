<script>
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';

    let username = $state('')
    let email = $state('')
    let password = $state('')
    let error = $state('')
    let loading = $state(false)

    async function register() {
        loading = true
        const { data, error: err } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        })

        if (err) {
            error = err.message
            loading = false
            return
        }
        loading = false
        goto('/dashboard')
    }
</script>

<div class="flex flex-col items-center justify-center w-screen h-screen bg-bg-primary overflow-y-auto p-4">
  <div class="flex flex-col items-center bg-surface w-full max-w-sm rounded-2xl border border-surface-border py-10 gap-6">
    
    <div class="flex flex-col items-center gap-2">
      <img src="/logo.png" alt="Logo" class="h-16" />
      <p class="text-text-primary text-xl">Minecraft <span class="font-bold text-green">World Backup</span></p>
    </div>

    <div class="flex flex-col w-full px-8 gap-5">

      <div class="flex flex-col gap-2">
        <label for="username" class="text-text-muted text-base">Username</label>
        <input
          bind:value={username}
          id="username"
          type="text"
          placeholder="username"
          class="h-11 rounded-lg bg-field border border-surface-border px-4 text-text-primary text-base focus:outline-none focus:border-green"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="text-text-muted text-base">Email address</label>
        <input
          bind:value={email}
          id="email"
          type="email"
          placeholder="you@example.com"
          class="h-11 rounded-lg bg-field border border-surface-border px-4 text-text-primary text-base focus:outline-none focus:border-green"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="text-text-muted text-base">Password</label>
        <input
          bind:value={password}
          id="password"
          type="password"
          placeholder="••••••••"
          onkeydown={(e) => e.key === 'Enter' && register()}
          class="h-11 rounded-lg bg-field border border-surface-border px-4 text-text-primary text-base focus:outline-none focus:border-green"
        />
      </div>

      <button class="h-11 rounded-lg bg-green hover:bg-green-dark text-bg-primary font-semibold text-base transition-colors cursor-pointer" 
      onclick={register}
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
                        Creating...
                    </div>
                {:else}
                    Create an account
                {/if}
      </button>

      {#if error}
        <p class="text-red-500 text-sm">{error}</p>
      {/if}

    </div>

    <div class="flex items-center gap-3 w-full px-8">
      <div class="flex-1 h-px bg-surface-border"></div>
      <span class="text-text-muted text-sm">or</span>
      <div class="flex-1 h-px bg-surface-border"></div>
    </div>

    <p class="text-text-muted text-base">
      Already have an account?
      <a href="/login" class="text-green hover:underline">Log in</a>
    </p>

  </div>
</div>