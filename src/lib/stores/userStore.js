import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { walletAddress } from './walletStore';
import { airdrop as defaultAirdrops } from '../airdrop';

const STORAGE_KEY = 'airdrop-tracker-user-data';

// Initial state structure
const createInitialState = () => ({
    users: {} // keyed by wallet address (lowercase)
});

// Helper to get default user data
const createDefaultUserData = (address) => {
    const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
    return {
        profile: {
            name: 'Farmer',
            role: 'Airdrop Farmer',
            wallet: address || '',
            bio: 'Grinding L1, L2, and testnet airdrops.',
            goals: ''
        },
        airdrops: structuredClone(defaultAirdrops).map(a => ({
            ...a,
            completedQuests: 0 // Ensure fresh start
        })),
        onboardingDismissed: false
    };
};

function createUserStore() {
    const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
    const initialState = stored ? JSON.parse(stored) : createInitialState();

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        // Update a specific user's profile
        updateProfile: (address, profileData) => update(state => {
            const addr = address.toLowerCase();
            if (!state.users[addr]) {
                state.users[addr] = createDefaultUserData(addr);
            }
            state.users[addr].profile = { ...state.users[addr].profile, ...profileData };
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return state;
        }),
        // Update a specific user's airdrop progress
        updateAirdrop: (address, slug, airdropData) => update(state => {
            const addr = address.toLowerCase();
            if (!state.users[addr]) {
                state.users[addr] = createDefaultUserData(addr);
            }
            const index = state.users[addr].airdrops.findIndex(a => a.slug === slug);
            if (index !== -1) {
                state.users[addr].airdrops[index] = { ...state.users[addr].airdrops[index], ...airdropData };
            } else {
                // If new airdrop (e.g. added manually), push it
                state.users[addr].airdrops.push(airdropData);
            }
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return state;
        }),
        // Add a new airdrop to the user's list
        addAirdrop: (address, newAirdrop) => update(state => {
            const addr = address.toLowerCase();
            if (!state.users[addr]) {
                state.users[addr] = createDefaultUserData(addr);
            }
            state.users[addr].airdrops.push(newAirdrop);
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return state;
        }),
        // Set onboarding dismissed
        dismissOnboarding: (address) => update(state => {
            const addr = address.toLowerCase();
            if (!state.users[addr]) {
                state.users[addr] = createDefaultUserData(addr);
            }
            state.users[addr].onboardingDismissed = true;
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return state;
        }),
        // Reset user data (delete profile)
        resetUser: (address) => update(state => {
            const addr = address.toLowerCase();
            if (state.users[addr]) {
                delete state.users[addr];
            }
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return state;
        }),
        // Ensure user exists (called when connecting)
        initUser: (address) => update(state => {
            const addr = address.toLowerCase();
            if (!state.users[addr]) {
                state.users[addr] = createDefaultUserData(addr);
                if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            }
            return state;
        })
    };
}

export const userStore = createUserStore();

// Derived store for the CURRENT user's data
export const currentUserData = derived(
    [userStore, walletAddress],
    ([$userStore, $walletAddress]) => {
        if (!$walletAddress) return null;
        const addr = $walletAddress.toLowerCase();
        return $userStore.users[addr] || createDefaultUserData(addr);
    }
);
