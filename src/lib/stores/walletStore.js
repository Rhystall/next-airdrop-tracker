import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import EthereumProvider from '@walletconnect/ethereum-provider';

const STORAGE_KEY = 'wallet-address';
const CONNECTION_KEY = 'wallet-connection-type';
const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const initialAddress = browser ? localStorage.getItem(STORAGE_KEY) ?? '' : '';
const initialConnectionType = browser ? localStorage.getItem(CONNECTION_KEY) ?? '' : '';

export const walletAddress = writable(initialAddress);
export const isConnecting = writable(false);
export const connectionType = writable(initialConnectionType);

let walletConnectProvider;
let injectedListenersRegistered = false;

const handleAccountsChanged = (accounts) => {
	const next = accounts?.[0]?.toLowerCase() ?? '';
	walletAddress.set(next);
};

async function ensureWalletConnectProvider() {
	if (!PROJECT_ID) {
		throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID');
	}

	if (!walletConnectProvider) {
		const metadata = {
			name: 'Airdrop Quest Tracker',
			description: 'Track and plan airdrop quests across chains.',
			url: browser ? window.location.origin : 'https://airdrop.quest',
			icons: ['https://avatars.githubusercontent.com/u/37784886?s=200&v=4']
		};

	walletConnectProvider = await EthereumProvider.init({
		projectId: PROJECT_ID,
		showQrModal: true,
		chains: [1],
		optionalChains: [10, 137, 8453, 42161, 59144],
			methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData', 'eth_sign'],
			optionalMethods: ['eth_signTypedData_v4'],
			events: ['accountsChanged', 'chainChanged', 'disconnect'],
		metadata
	});

	walletConnectProvider.on('accountsChanged', handleAccountsChanged);
	walletConnectProvider.on('disconnect', () => {
		walletAddress.set('');
		connectionType.set('');
	});
}

if (!walletConnectProvider.session) {
	await walletConnectProvider.connect();
}

return walletConnectProvider;
}

function getInjectedProvider() {
	if (!browser || typeof window === 'undefined') return null;
	const { ethereum } = window;
	if (!ethereum) return null;

	if (!injectedListenersRegistered && ethereum.on) {
		ethereum.on('accountsChanged', handleAccountsChanged);
		ethereum.on('disconnect', () => walletAddress.set(''));
		injectedListenersRegistered = true;
	}

	return ethereum;
}

async function requestAccounts() {
	const injected = getInjectedProvider();
	if (injected) {
		const accounts = await injected.request({ method: 'eth_requestAccounts' });
		return { accounts, type: 'injected' };
	}

	const provider = await ensureWalletConnectProvider();
	const accounts = await provider.request({ method: 'eth_requestAccounts' });
	return { accounts, type: 'walletconnect' };
}

export async function connectWallet() {
	if (!browser) return;
	isConnecting.set(true);
	try {
		const { accounts, type } = await requestAccounts();
		handleAccountsChanged(accounts);
		connectionType.set(type);
	} finally {
		isConnecting.set(false);
	}
}

export async function disconnectWallet() {
	if (!browser) return;
	const injected = getInjectedProvider();
	if (injected?.disconnect) {
		await injected.disconnect();
	}

	if (walletConnectProvider) {
		try {
			await walletConnectProvider.disconnect();
		} catch (error) {
			console.error('Failed to disconnect WalletConnect', error);
		}
		walletConnectProvider = null;
	}

	connectionType.set('');
	walletAddress.set('');
}

if (browser) {
	const persist = (value) => {
		if (value) {
			localStorage.setItem(STORAGE_KEY, value);
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	};

	walletAddress.subscribe(persist);

	const persistConnectionType = (value) => {
		if (value) {
			localStorage.setItem(CONNECTION_KEY, value);
		} else {
			localStorage.removeItem(CONNECTION_KEY);
		}
	};

	connectionType.subscribe(persistConnectionType);

	const injected = getInjectedProvider();
	if (initialConnectionType === 'injected' && injected?.selectedAddress) {
		handleAccountsChanged([injected.selectedAddress]);
	}

	if (initialConnectionType === 'walletconnect') {
		ensureWalletConnectProvider().catch((error) => {
			console.error('Failed to restore WalletConnect session', error);
			connectionType.set('');
		});
	}
}
