import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'app-theme';
const DEFAULT_THEME = 'dark';

const initialTheme = browser
  ? localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME
  : DEFAULT_THEME;

export const theme = writable(initialTheme);

if (browser) {
  const applyTheme = (value) => {
    document.documentElement.dataset.theme = value;
    localStorage.setItem(STORAGE_KEY, value);
  };

  applyTheme(initialTheme);
  theme.subscribe(applyTheme);
}

export function toggleTheme() {
  theme.update((value) => (value === 'dark' ? 'light' : 'dark'));
}
