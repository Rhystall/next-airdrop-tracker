<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function selectProvider(type) {
    dispatch('select', type);
    close();
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={close} transition:fade={{ duration: 200 }}>
    <div class="modal-content" on:click|stopPropagation transition:scale={{ duration: 200, start: 0.95 }}>
      <div class="modal-header">
        <h2 class="modal-title">Connect Wallet</h2>
        <button class="modal-close" on:click={close}>✕</button>
      </div>
      
      <div class="wallet-options">
        <button class="wallet-option" on:click={() => selectProvider('injected')}>
          <div class="wallet-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div class="wallet-info">
            <span class="wallet-name">Browser Wallet</span>
            <span class="wallet-desc">MetaMask, Rabby, etc.</span>
          </div>
        </button>

        <button class="wallet-option" on:click={() => selectProvider('walletconnect')}>
          <div class="wallet-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32" class="text-blue-500">
              <path d="M6.5 14.5v-3.22l2.28 2.28 1.42-1.42-3.7-3.7-3.7 3.7 1.42 1.42 2.28-2.28v3.22h-3v-3.22l2.28 2.28 1.42-1.42-3.7-3.7-3.7 3.7 1.42 1.42 2.28-2.28v3.22h-3z" transform="translate(12,12) scale(0.8)"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <div class="wallet-info">
            <span class="wallet-name">WalletConnect</span>
            <span class="wallet-desc">Mobile wallets, Rainbow, etc.</span>
          </div>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 1.25rem;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .modal-close:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .wallet-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .wallet-option {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .wallet-option:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
  }

  .wallet-icon {
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wallet-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .wallet-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
  }

  .wallet-desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
