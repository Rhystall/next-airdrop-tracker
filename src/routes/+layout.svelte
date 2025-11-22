<script>
	import favicon from '$lib/assets/favicon.svg';
	import "../app.css";
	import WalletModal from '$lib/components/WalletModal.svelte';
	import { isWalletModalOpen, connectWallet } from '$lib/stores/walletStore';

	let { children } = $props();

	function handleWalletSelect(event) {
		connectWallet(event.detail);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<WalletModal 
	isOpen={$isWalletModalOpen} 
	on:close={() => isWalletModalOpen.set(false)}
	on:select={handleWalletSelect}
/>
