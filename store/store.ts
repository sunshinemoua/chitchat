import { create } from "zustand";
import { Subscription } from "../types/Subscription";
import {
  BasicLanguagesSupported,
  LanguagesSupported,
  LanguagesSupportedMap,
} from "../types/Languages";

interface LanguageState {
  language: LanguagesSupported;
  setLanguage: (language: LanguagesSupported) => void;
  getLanguages: (isPro: boolean) => LanguagesSupported[];
  getUnsupportedLanguages: (isPro: boolean) => LanguagesSupported[];
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",
  setLanguage: (language: LanguagesSupported) => set({ language }),
  getLanguages: (isPro: boolean) => {
    // If Pro, return all languages
    if (isPro)
      return Object.keys(LanguagesSupportedMap) as LanguagesSupported[];
    // Else return languages supported for BASIC plan
    return Object.keys(LanguagesSupportedMap).filter((key) =>
      BasicLanguagesSupported.includes(key)
    ) as LanguagesSupported[];
  },
  getUnsupportedLanguages: (isPro: boolean) => {
    // No unsupported languages for pro users
    if (isPro) return [];
    // Excludes languages in basic plan
    return Object.keys(LanguagesSupportedMap).filter(
      (key) => !BasicLanguagesSupported.includes(key)
    ) as LanguagesSupported[];
  },
}));
interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

// Zustand store for managing subscription state with setter func
export const userSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));
