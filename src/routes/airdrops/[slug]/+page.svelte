<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { theme, toggleTheme } from '$lib/stores/themeStore';

    export let data;
    const airdrop = data.airdrop;


  const NOTES_KEY = `notes-${airdrop.slug}`;
  const PROGRESS_KEY = `progress-${airdrop.slug}`;

  // set berisi index quest yang sudah selesai
  let completedSet = new Set();
  let notes = '';

  const totalQuests = airdrop.quests.length;

  // derived values (otomatis ke-update kalau completedSet berubah)
  $: completedCount = completedSet.size;
  $: progress = totalQuests
    ? Math.round((completedCount / totalQuests) * 100)
    : 0;

  onMount(() => {
    if (!browser) return;

    // load progress dari localStorage
    try {
      const storedProgress = localStorage.getItem(PROGRESS_KEY);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        if (Array.isArray(parsed)) {
          completedSet = new Set(parsed);
        }
      }

      const storedNotes = localStorage.getItem(NOTES_KEY);
      if (storedNotes !== null) {
        notes = storedNotes;
      }
    } catch (error) {
      console.error('Failed to read local data', error);
    }
  });

  function toggleQuest(index) {
    const updated = new Set(completedSet);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    completedSet = updated;
    saveProgress(updated);
  }

  function saveProgress(set = completedSet) {
    if (!browser) return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
  }

  // setiap notes berubah → simpan
  $: if (browser) {
    localStorage.setItem(NOTES_KEY, notes);
  }

  function goBack() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Airdrop Detail - {airdrop.name}</title>
</svelte:head>

<!-- Header -->
<header class="header">
  <div class="header-container">
    <div class="header-left">
      <button class="btn btn-ghost" type="button" on:click={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to list
      </button>

      <div class="breadcrumb">
        <span>Home</span>
        <span>/</span>
        <span class="breadcrumb-current">{airdrop.name}</span>
      </div>
    </div>

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
</header>

<!-- Main Content -->
<main class="main-content">
  <!-- Header Card -->
  <div class="header-card">
    <div class="header-content">
      <div class="header-left">
        <h1>{airdrop.name}</h1>

        <div class="badges">
          <span class={"badge badge-chain-" + airdrop.chain}>{airdrop.chain}</span>
          <span class={"badge badge-difficulty-" + airdrop.difficulty}>
            {airdrop.difficulty}
          </span>
        </div>

        <p class="description">{airdrop.description}</p>

        <div class="tags">
          {#each airdrop.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </div>

      <div class="header-actions">
        <a
          class="btn btn-primary"
          href={airdrop.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Open dApp
        </a>

        <a
          class="btn btn-outline"
          href={airdrop.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          View docs
        </a>
      </div>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-icon stat-icon-cyan">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stat-label">Quests</p>
          <p class="stat-value">{completedCount}/{totalQuests}</p>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-icon stat-icon-amber">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p class="stat-label">Risk</p>
          <p class="stat-value">{airdrop.estimatedRisk ?? airdrop.difficulty}</p>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-icon stat-icon-purple">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stat-label">Time/Week</p>
          <p class="stat-value">{airdrop.avgTimePerWeek ?? '2–3 hrs'}</p>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-icon stat-icon-fuchsia">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <div>
          <p class="stat-label">Chain</p>
          <p class="stat-value">{airdrop.chain}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Quest Section -->
  <div class="quest-section">
    <div class="quest-header">
      <h2>Quests</h2>
      <span class="progress-percent">{progress}% Complete</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style={`width: ${progress}%`}></div>
    </div>

    <div class="quest-list">
      {#each airdrop.quests as quest, index}
        <div class={"quest-item " + (completedSet.has(index) ? 'completed' : '')}>
          <div
            class={"checkbox " + (completedSet.has(index) ? 'checked' : '')}
            on:click|stopPropagation={() => toggleQuest(index)}
          ></div>
          <div class="quest-text" on:click={() => toggleQuest(index)}>
            {quest}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Notes Section -->
  <div class="notes-section">
    <h2>My Notes / Strategy</h2>
    <textarea
      class="notes-textarea"
      placeholder="Add your notes, strategies, or reminders here..."
      bind:value={notes}
    ></textarea>
  </div>
</main>
