import { atom } from "jotai";

// Get API key from environment variable
const getApiKeyFromEnv = (): string | null => {
  const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
  return apiKey || null;
};

// Atom to store the API token from environment
export const apiTokenAtom = atom<string | null>(getApiKeyFromEnv());

// Atom to track if token is being validated
export const isValidatingTokenAtom = atom(false);

// Atom to store token validation result
export const tokenValidationAtom = atom<{ valid: boolean; error?: string } | null>(null);

// Derived atom to check if token exists
export const hasTokenAtom = atom((get) => get(apiTokenAtom) !== null);

// Derived atom to check if token is valid
export const isTokenValidAtom = atom((get) => {
  const validation = get(tokenValidationAtom);
  return validation?.valid === true;
});