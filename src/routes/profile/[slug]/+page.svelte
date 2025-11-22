<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { theme, toggleTheme } from '$lib/stores/themeStore';
import { walletAddress, connectWallet, disconnectWallet, isConnecting, isWalletModalOpen } from '$lib/stores/walletStore';

    export let data;
    const airdrops = data.airdrops ?? [];
    const profileSlug = data.slug ?? 'farmer';

  const defaultName = profileSlug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Farmer';

  const defaultProfile = {
    name: defaultName,
    role: 'Airdrop Farmer',
    wallet: '0x3a...f9c',
    bio: 'Grinding L1, L2, and testnet airdrops.'
  };

  let chainFilter = 'All';
  let goalsNotes = '';

  let profile = structuredClone(defaultProfile);
  let profileForm = structuredClone(defaultProfile);
  let connectError = '';
  let showOnboarding = false;
  let onboardingDismissed = false;

  // --- DERIVED STATS DARI AIRDROPS ---
  const totalAirdrops = airdrops.length;
  const totalQuests = airdrops.reduce((sum, a) => sum + a.quests.length, 0);

  $: completedQuests = airdrops.reduce(
    (sum, a) => sum + (a.completedQuests ?? 0),
    0
  );
  $: completionRate =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  $: chainsActive = new Set(airdrops.map((a) => a.chain)).size;

  // --- BY CHAIN STATS ---
  const chainOrder = ['HyperEVM', 'L2', 'Testnet', 'L1'];
  $: chainStats = chainOrder.map((chain) => {
    const list = airdrops.filter((a) => a.chain === chain);
    const count = list.length;
    const percent =
      totalAirdrops > 0 ? Math.round((count / totalAirdrops) * 100) : 0;
    return { chain, count, percent };
  });

  // --- DIFFICULTY MIX ---
  const difficultyOrder = ['Low', 'Medium', 'High'];
  $: difficultyStats = difficultyOrder.map((d) => ({
    difficulty: d,
    count: airdrops.filter((a) => a.difficulty === d).length
  }));

  // --- FILTER ACTIVE AIRDROPS ---
  $: filteredAirdrops =
    chainFilter === 'All'
      ? airdrops
      : airdrops.filter((a) => a.chain === chainFilter);

  // --- NOTES LOCALSTORAGE ---
  $: profileStorageKey = `profile-data-${profileSlug}`;
  $: notesStorageKey = `profile-goals-notes-${profileSlug}`;
  $: onboardingKey = `profile-onboarding-dismissed-${profileSlug}`;

  onMount(() => {
    if (!browser) return;
    loadProfile();
    
    const savedNotes = localStorage.getItem(notesStorageKey);
    if (savedNotes) goalsNotes = savedNotes;
  });

  // Reactive load of onboarding status when key changes
  $: if (browser && onboardingKey) {
    const dismissedFlag = localStorage.getItem(onboardingKey);
    // Only update if we haven't already dismissed it in this session to avoid flickering
    if (dismissedFlag === '1') {
        onboardingDismissed = true;
    }
  }

  $: if (browser) {
    // auto-save tiap kali goalsNotes berubah
    localStorage.setItem(notesStorageKey, goalsNotes);
  }

  function formatAddress(address) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  }

  async function handleConnectWallet() {
    connectError = '';
    isWalletModalOpen.set(true);
  }

  async function handleDisconnectWallet() {
    connectError = '';
    try {
      await disconnectWallet();
      deleteProfile();
      goto('/profile/farmer');
    } catch (error) {
      connectError = error?.message ?? 'Failed to disconnect wallet';
      console.error(error);
    }
  }

  function loadProfile() {
    if (!browser) return;
    const stored = localStorage.getItem(profileStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        profile = sanitizeProfile({ ...defaultProfile, ...parsed });
      } catch {
        profile = structuredClone(defaultProfile);
      }
    } else {
      profile = structuredClone(defaultProfile);
    }
    profileForm = structuredClone(profile);
  }

  function sanitizeProfile(data) {
    return {
      name: data.name?.trim() || defaultProfile.name,
      role: data.role?.trim() || defaultProfile.role,
      wallet: data.wallet?.trim() || defaultProfile.wallet,
      bio: data.bio?.trim() || defaultProfile.bio
    };
  }

  function saveProfile(event) {
    event?.preventDefault?.();
    profile = sanitizeProfile(profileForm);
    profileForm = structuredClone(profile);
    if (!needsProfileDetails(profile)) {
      onboardingDismissed = true;
      showOnboarding = false;
      if (browser) {
        localStorage.setItem(onboardingKey, '1');
      }
    }
    if (browser) {
      localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    }
  }

  function resetProfileForm() {
    profileForm = structuredClone(profile);
  }

  function deleteProfile() {
    profile = structuredClone(defaultProfile);
    profileForm = structuredClone(defaultProfile);
    // Do not reset onboardingDismissed here, user might want to keep it dismissed
    // or if they really want to reset, they can clear storage.
    // But for now, let's keep it consistent with "new profile" feeling
    onboardingDismissed = false; 
    if (browser) {
      localStorage.removeItem(profileStorageKey);
      localStorage.removeItem(onboardingKey);
    }
  }

  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase())
      .slice(0, 2)
      .join('') || 'FP';
  }

  function closeOnboarding() {
    showOnboarding = false;
    onboardingDismissed = true;
    if (browser) {
      localStorage.setItem(onboardingKey, '1');
    }
  }

  function handleOnboardingSubmit(event) {
    saveProfile(event);
    closeOnboarding();
  }

  function needsProfileDetails(currentProfile) {
    const trimmedName = currentProfile.name?.trim() ?? '';
    const trimmedWallet = currentProfile.wallet?.trim().toLowerCase() ?? '';
    if (!trimmedName) return true;
    if (trimmedName === defaultName) return true;
    if (trimmedWallet && trimmedName.toLowerCase() === trimmedWallet) return true;
    return false;
  }

  $: if ($walletAddress) {
    const normalized = $walletAddress.toLowerCase();
    if (profile.wallet !== normalized) {
      profile = { ...profile, wallet: normalized };
      if (browser) {
        localStorage.setItem(profileStorageKey, JSON.stringify(profile));
      }
    }
    if (profileForm.wallet !== normalized) {
      profileForm = { ...profileForm, wallet: normalized };
    }
    const profileNeedsDetails = needsProfileDetails(profile);
    
    // Only show if NOT dismissed AND needs details
    if (!onboardingDismissed && profileNeedsDetails) {
      showOnboarding = true;
    } else if (!profileNeedsDetails) {
      // If details are filled, ensure we mark as dismissed
      showOnboarding = false;
      onboardingDismissed = true;
      if (browser) {
        localStorage.setItem(onboardingKey, '1');
      }
    }
  } else {
    showOnboarding = false;
    // REMOVED: onboardingDismissed = false; 
    // We shouldn't reset this just because wallet disconnected.
  }

  $: displayName = profile.name || defaultProfile.name;
  $: displayRole = profile.role || defaultProfile.role;
  $: displayBio = profile.bio || defaultProfile.bio;
  $: displayWallet = profile.wallet || defaultProfile.wallet;
  $: profileInitials = getInitials(displayName);

  // helper label difficulty → teks
  const difficultyLabel = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High'
  };
</script>

<svelte:head>
  <title>Farmer Profile - Airdrop Quest Tracker</title>
</svelte:head>

<!-- Header -->
<header class="header">
  <div class="header-container">
    <div class="header-left">
      <a href="/" class="logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </a>
      <h1>Farmer Profile</h1>
    </div>
    <div class="header-right">
      {#if $walletAddress}
        <button class="wallet-pill wallet-pill-connected" type="button" on:click={() => goto(`/profile/${$walletAddress.toLowerCase()}`)}>
          {formatAddress($walletAddress)}
        </button>
        <button class="btn btn-outline wallet-disconnect" type="button" on:click={handleDisconnectWallet}>
          Disconnect
        </button>
      {:else}
        <button class="wallet-pill wallet-pill-connect" type="button" on:click={handleConnectWallet} disabled={$isConnecting}>
          {#if $isConnecting}Connecting...{:else}Connect Wallet{/if}
        </button>
      {/if}
      <button class="settings-btn" type="button" aria-label="Toggle theme" on:click={toggleTheme}>
        {#if $theme === 'dark'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</header>

{#if connectError}
  <p class="connect-error-text">{connectError}</p>
{/if}

<!-- Main Content -->
<main class="main-content">
  <!-- Profile Summary Card -->
  <section class="profile-card">
    <div class="profile-content">
      <div class="profile-left">
        <div class="avatar">{profileInitials}</div>
        <div class="profile-info">
          <h2>{displayName}</h2>
          <p class="profile-role">{displayRole}</p>
          <p class="profile-bio">{displayBio}</p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-pill">
          <div class="stat-value">{totalAirdrops}</div>
          <div class="stat-label">Tracked Airdrops</div>
        </div>
        <div class="stat-pill">
          <div class="stat-value">{completedQuests}</div>
          <div class="stat-label">Completed Quests</div>
        </div>
        <div class="stat-pill">
          <div class="stat-value">{completionRate}%</div>
          <div class="stat-label">Overall Completion</div>
        </div>
        <div class="stat-pill">
          <div class="stat-value">{chainsActive}</div>
          <div class="stat-label">Chains Active</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats & Overview Section -->
  <section class="stats-grid">
    <!-- By Chain -->
    <div class="stat-card">
      <h3>By Chain</h3>
      <div class="chain-list">
        {#each chainStats as cs}
          {#if cs.count > 0}
            <div class="chain-item">
              <div class="chain-header">
                <span class="chain-name">{cs.chain}</span>
                <span class="chain-count">{cs.count}</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill {cs.chain === 'HyperEVM'
                    ? 'progress-fuchsia'
                    : cs.chain === 'L2'
                    ? 'progress-purple'
                    : cs.chain === 'Testnet'
                    ? 'progress-blue'
                    : 'progress-cyan'}"
                  style={`width: ${cs.percent}%`}
                />
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Difficulty Mix -->
    <div class="stat-card">
      <h3>Difficulty Mix</h3>
      <div class="difficulty-list">
        {#each difficultyStats as ds}
          <div class="difficulty-item">
            <div
              class="difficulty-color {ds.difficulty === 'Low'
                ? 'difficulty-low'
                : ds.difficulty === 'Medium'
                ? 'difficulty-medium'
                : 'difficulty-high'}"
            />
            <span class="difficulty-label">{difficultyLabel[ds.difficulty]}</span>
            <span class="difficulty-value">{ds.count} airdrops</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Weekly Activity (dummy / static for now) -->
    <div class="stat-card">
      <h3>Weekly Activity</h3>
      <div class="activity-chart">
        <div class="activity-bar" style="height: 60%"></div>
        <div class="activity-bar" style="height: 45%"></div>
        <div class="activity-bar" style="height: 80%"></div>
        <div class="activity-bar" style="height: 35%"></div>
        <div class="activity-bar" style="height: 70%"></div>
        <div class="activity-bar" style="height: 90%"></div>
        <div class="activity-bar" style="height: 55%"></div>
      </div>
    </div>

    <!-- Current Streak (dummy value) -->
    <div class="stat-card">
      <h3>Current Streak</h3>
      <div class="streak-display">
        <div class="streak-icon">🔥</div>
        <div class="streak-number">7</div>
        <div class="streak-label">days active</div>
      </div>
    </div>
  </section>

  <!-- Active Airdrops & Preferences Layout -->
  <section class="layout-grid">
    <!-- Left Column: Active Airdrops -->
    <div>
      <!-- Active Airdrops -->
      <div class="section">
        <div class="section-header">
          <h2>Active Airdrops</h2>
          <select
            class="filter-select"
            bind:value={chainFilter}
          >
            <option value="All">All Chains</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="HyperEVM">HyperEVM</option>
            <option value="Testnet">Testnet</option>
          </select>
        </div>

        <div class="airdrops-list">
          {#each filteredAirdrops as airdrop}
            {@const completed = airdrop.completedQuests ?? 0}
            {@const total = airdrop.quests.length}
            {@const progress =
              total > 0 ? Math.round((completed / total) * 100) : 0}
            <div class="airdrop-item">
              <div class="airdrop-info">
                <div class="airdrop-header">
                  <span class="airdrop-name">{airdrop.name}</span>
                  <span class={`badge badge-chain-${airdrop.chain}`}>
                    {airdrop.chain}
                  </span>
                  <span class={`badge badge-difficulty-${airdrop.difficulty}`}>
                    {airdrop.difficulty}
                  </span>
                </div>
                <div class="airdrop-progress">
                  <div class="progress-text">
                    {completed}/{total} quests
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill progress-cyan"
                      style={`width: ${progress}%`}
                    />
                  </div>
                </div>
              </div>
              <a class="btn-view" href={`/airdrops/${airdrop.slug}`}>
                View
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Column: Goals & Notes -->
    <div>
      <div class="section">
        <h2>Goals & Notes</h2>
        <div class="notes-card">
          <textarea
            class="notes-textarea"
            bind:value={goalsNotes}
            placeholder="Write your farming plan, priority airdrops, or reminders here..."
          />
        </div>
      </div>

      <div class="section">
        <h2>Profile Settings</h2>
        <div class="notes-card">
          <form class="profile-form" on:submit|preventDefault={saveProfile}>
            <div class="form-group">
              <label class="form-label" for="profile-name">Name</label>
              <input id="profile-name" class="form-input" bind:value={profileForm.name} placeholder="Your display name" />
            </div>

            <div class="form-group">
              <label class="form-label" for="profile-role">Role</label>
              <input id="profile-role" class="form-input" bind:value={profileForm.role} placeholder="e.g., Airdrop Farmer" />
            </div>

            <div class="form-group">
              <label class="form-label" for="profile-wallet">Wallet</label>
              <input id="profile-wallet" class="form-input" bind:value={profileForm.wallet} placeholder="0x..." />
            </div>

            <div class="form-group">
              <label class="form-label" for="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                class="form-textarea"
                bind:value={profileForm.bio}
                rows="4"
                placeholder="Short description about your farming strategy"
              ></textarea>
            </div>

            <div class="profile-form-actions">
              <button class="btn btn-primary" type="submit">Save Profile</button>
              <button class="btn-secondary" type="button" on:click={resetProfileForm}>Cancel</button>
              <button class="btn-danger" type="button" on:click={deleteProfile}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</main>

{#if showOnboarding}
  <div class="modal-overlay active" role="dialog" aria-modal="true" aria-label="Complete profile">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Complete Your Profile</h2>
        <button class="modal-close" type="button" on:click={closeOnboarding} aria-label="Close">
          ✕
        </button>
      </div>
      <p class="modal-description">Choose a username, role, and short bio so other farmers can recognize you.</p>
      <form on:submit|preventDefault={handleOnboardingSubmit}>
        <div class="form-group">
          <label class="form-label" for="onboarding-name">Name</label>
          <input id="onboarding-name" class="form-input" bind:value={profileForm.name} placeholder="Your display name" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="onboarding-role">Role</label>
          <input id="onboarding-role" class="form-input" bind:value={profileForm.role} placeholder="e.g., L2 Grinder" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="onboarding-bio">Bio</label>
          <textarea
            id="onboarding-bio"
            class="form-textarea"
            bind:value={profileForm.bio}
            rows="4"
            placeholder="Tell others about your strategy"
            required
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" on:click={closeOnboarding}>Skip</button>
          <button class="btn btn-primary" type="submit">Save Profile</button>
        </div>
      </form>
    </div>
  </div>
{/if}
