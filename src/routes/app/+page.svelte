<script>
    import { goto } from '$app/navigation';
    import { theme, toggleTheme } from '$lib/stores/themeStore';
    import { walletAddress, connectWallet, disconnectWallet, isConnecting } from '$lib/stores/walletStore';
    export let data;

    let airdrops = structuredClone(data.airdrop);
    const defaultProfileSlug = 'farmer';
    $: profileSlug = $walletAddress ? $walletAddress.toLowerCase() : defaultProfileSlug;

    let filters = {
        chain: "All",
        difficulty: "All",
        search: ""
    }

    let isModalOpen = false;

    let form = {
        name: "",
        slug: "",
        chain: "Ethereum",
        difficulty: "Easy",
        link: "",
        tags: "",
        description: "",
        quests: ""
    };

    // airdrop setelah difilter
  $: filteredAirdrops = airdrops.filter((airdrop) => {
    const matchesChain =
      filters.chain === "All" || airdrop.chain === filters.chain;
    const matchesDifficulty =
      filters.difficulty === "All" || airdrop.difficulty === filters.difficulty;

    const search = filters.search.trim().toLowerCase();
    const matchesSearch =
      !search ||
      airdrop.name.toLowerCase().includes(search) ||
      airdrop.description.toLowerCase().includes(search);

    return matchesChain && matchesDifficulty && matchesSearch;
  });

  // hitung summary
  $: totalAirdrops = airdrops.length;
  $: totalQuests = airdrops.reduce(
    (sum, a) => sum + (a.quests?.length ?? 0),
    0
  );
  $: completedQuests = airdrops.reduce(
    (sum, a) => sum + (a.completedQuests ?? 0),
    0
  );
  $: completionRate =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  // tambahin statistik sederhana per airdrop
  $: airdropsWithStats = filteredAirdrops.map((a) => {
    const completed = a.completedQuests ?? 0;
    const total = a.quests?.length ?? 0;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    return { ...a, completedQuests: completed, totalQuests: total, progress };
  });

  function setFilter(type, value) {
    filters = { ...filters, [type]: value };
  }

  function handleSearch(event) {
    filters = { ...filters, search: event.target.value };
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    form = {
      name: "",
      slug: "",
      chain: "",
      difficulty: "",
      link: "",
      tags: "",
      description: "",
      quests: ""
    };
  }

  function saveAirdrop(event) {
    event.preventDefault();

    const newAirdrop = {
      slug: form.slug,
      name: form.name,
      chain: form.chain,
      difficulty: form.difficulty,
      link: form.link,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: form.description,
      quests: form.quests
        .split("\n")
        .map((q) => q.trim())
        .filter(Boolean),
      completedQuests: 0
    };

    airdrops = [...airdrops, newAirdrop];
    closeModal();
  }

  function goToDetail(slug) {
    goto(`/airdrops/${slug}`);
  }

  let connectError = '';

  function formatAddress(address) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  }

  async function handleConnectWallet() {
    connectError = '';
    try {
      await connectWallet();
      goto(`/profile/${profileSlug}`);
    } catch (error) {
      connectError = error?.message ?? 'Failed to connect wallet';
      console.error(error);
    }
  }

  async function handleDisconnectWallet() {
    connectError = '';
    try {
      await disconnectWallet();
    } catch (error) {
      connectError = error?.message ?? 'Failed to disconnect wallet';
      console.error(error);
    }
  }

  function goToProfile() {
    goto(`/profile/${profileSlug}`);
  }
    
</script>

<svelte:head>
    <title>Airdrops Quest Tracker</title>
</svelte:head>

<header class="header">
  <div class="header-container">
    <div class="header-left">
      <div class="logo">
        <!-- ikon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
      <div class="header-title">
        <h1>Airdrop Quest Tracker</h1>
        <p>Track your farming progress across chains</p>
      </div>
    </div>
    <div class="header-right">
      <button class="btn btn-primary" on:click={openModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Airdrop
      </button>
      {#if $walletAddress}
        <button class="btn btn-outline" type="button" on:click={goToProfile}>
          {formatAddress($walletAddress)}
        </button>
        <button class="btn btn-outline wallet-disconnect" type="button" on:click={handleDisconnectWallet}>
          Disconnect
        </button>
      {:else}
        <button class="btn btn-outline" type="button" on:click={handleConnectWallet} disabled={$isConnecting}>
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
      <button class="profile-circle" type="button" on:click={goToProfile}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </div>
  </div>
</header>

{#if connectError}
  <p class="connect-error-text">{connectError}</p>
{/if}

<!-- FILTER BAR -->
<div class="filter-bar">
  <div class="filter-container">
    <div class="filter-buttons">
      <div class="filter-group">
        <button
          class="filter-btn {filters.chain === 'All' ? 'active' : ''}"
          on:click={() => setFilter('chain', 'All')}
        >
          All
        </button>
        <button
          class="filter-btn {filters.chain === 'L1' ? 'active' : ''}"
          on:click={() => setFilter('chain', 'L1')}
        >
          L1
        </button>
        <button
          class="filter-btn {filters.chain === 'L2' ? 'active' : ''}"
          on:click={() => setFilter('chain', 'L2')}
        >
          L2
        </button>
        <button
          class="filter-btn {filters.chain === 'HyperEVM' ? 'active' : ''}"
          on:click={() => setFilter('chain', 'HyperEVM')}
        >
          HyperEVM
        </button>
        <button
          class="filter-btn {filters.chain === 'Testnet' ? 'active' : ''}"
          on:click={() => setFilter('chain', 'Testnet')}
        >
          Testnet
        </button>
      </div>
      <div class="filter-divider"></div>
      <div class="filter-group">
        <button
          class="filter-btn {filters.difficulty === 'All' ? 'active' : ''}"
          on:click={() => setFilter('difficulty', 'All')}
        >
          All
        </button>
        <button
          class="filter-btn {filters.difficulty === 'Low' ? 'active' : ''}"
          on:click={() => setFilter('difficulty', 'Low')}
        >
          Low
        </button>
        <button
          class="filter-btn {filters.difficulty === 'Medium' ? 'active' : ''}"
          on:click={() => setFilter('difficulty', 'Medium')}
        >
          Medium
        </button>
        <button
          class="filter-btn {filters.difficulty === 'High' ? 'active' : ''}"
          on:click={() => setFilter('difficulty', 'High')}
        >
          High
        </button>
      </div>
    </div>

    <div class="search-wrapper">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Search airdrop..."
        value={filters.search}
        on:input={handleSearch}
      />
    </div>
  </div>
</div>

<!-- MAIN CONTENT -->
<main class="main-content">
  <div class="content-grid">
    <!-- LIST AIRDROP -->
    <div id="airdropList">
      {#if airdropsWithStats.length === 0}
        <div class="empty-state">
          <p>No airdrops found matching your filters.</p>
        </div>
      {:else}
        {#each airdropsWithStats as airdrop (airdrop.slug)}
          <div class="airdrop-card" on:click={() => goToDetail(airdrop.slug)}>
            <div class="card-header">
              <div class="card-header-left">
                <h3 class="card-title">{airdrop.name}</h3>
                <div class="badges">
                  <span class={"badge badge-chain-" + airdrop.chain}>{airdrop.chain}</span>
                  <span class={"badge badge-difficulty-" + airdrop.difficulty}>
                    {airdrop.difficulty}
                  </span>
                </div>
              </div>
              <svg class="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <p class="card-description">{airdrop.description}</p>

            <div class="tags">
              {#each airdrop.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>

            <div class="progress-section">
              <div class="progress-header">
                <span class="progress-text">
                  {airdrop.completedQuests}/{airdrop.totalQuests} quests done
                </span>
                <span class="progress-percent">{airdrop.progress}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style={`width: ${airdrop.progress}%`}></div>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- SUMMARY WIDGET -->
    <div class="summary-widget">
      <h2>Summary</h2>
      <div class="summary-stats">
        <div class="stat-item">
          <div class="stat-icon stat-icon-cyan">
            <!-- ikon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="stat-label">Total Airdrops</p>
            <p class="stat-value">{totalAirdrops}</p>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon stat-icon-purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p class="stat-label">Total Quests</p>
            <p class="stat-value">{totalQuests}</p>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon stat-icon-fuchsia">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="stat-label">Completion Rate</p>
            <p class="stat-value-accent">{completionRate}%</p>
          </div>
        </div>
      </div>

      <div class="summary-overall">
        <div class="overall-circle">
          <span class="overall-percent">{completionRate}%</span>
        </div>
        <p class="overall-label">Overall Progress</p>
      </div>
    </div>
  </div>
</main>

<!-- MODAL ADD AIRDROP -->
<div class={"modal-overlay " + (isModalOpen ? "active" : "")} id="addModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Add New Airdrop</h2>
      <button class="modal-close" type="button" on:click={closeModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <form id="addAirdropForm" on:submit|preventDefault={saveAirdrop}>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="name">Name</label>
          <input id="name" class="form-input" bind:value={form.name} required />
        </div>
        <div class="form-group">
          <label class="form-label" for="slug">Slug</label>
          <input id="slug" class="form-input" placeholder="e.g., hyperliquid" bind:value={form.slug} required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="chain">Chain</label>
          <select id="chain" class="form-select" bind:value={form.chain} required>
            <option value="">Select chain</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="HyperEVM">HyperEVM</option>
            <option value="Testnet">Testnet</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="difficulty">Difficulty</label>
          <select id="difficulty" class="form-select" bind:value={form.difficulty} required>
            <option value="">Select difficulty</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="link">Link</label>
        <input id="link" type="url" class="form-input" placeholder="https://..." bind:value={form.link} required />
      </div>

      <div class="form-group">
        <label class="form-label" for="tags">Tags (comma-separated)</label>
        <input id="tags" class="form-input" placeholder="e.g., DEX, Perp, Active" bind:value={form.tags} />
      </div>

      <div class="form-group">
        <label class="form-label" for="description">Description</label>
        <textarea id="description" class="form-textarea" bind:value={form.description} required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="quests">Quests (one per line)</label>
        <textarea
          id="quests"
          class="form-textarea"
          placeholder="Deposit small amount&#10;Open 3 trades&#10;Do 5 social interactions"
          bind:value={form.quests}
          required
        ></textarea>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-secondary" on:click={closeModal}>Cancel</button>
        <button type="submit" class="btn btn-primary">Save Airdrop</button>
      </div>
    </form>
  </div>
</div>
