"use client";

// apps/web/contexts/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { JSX } from "react";
import enTranslations from "../locales/en.json";
import ptTranslations from "../locales/pt.json";

// Prevent SSR issues by checking if we're in the browser
const isBrowser = typeof window !== "undefined";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: { returnObjects?: boolean }) => any;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<string, any> = {
  en: enTranslations,
  pt: ptTranslations,
};

export const useLanguage = (): LanguageContextType => {
  // Always call useContext unconditionally (Rules of Hooks)
  const context = useContext(LanguageContext);

  if (context) {
    return context;
  }

  // Fallback when used outside LanguageProvider (should not happen in production)
  const fallbackT = (key: string): any => {
    const keys = key.split(".");
    let value: any = translations["en"];
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }
    return value ?? key;
  };

  return {
    language: "en",
    changeLanguage: () => {},
    t: fallbackT,
  };
};

export const LanguageProvider = ({
  children,
}: LanguageProviderProps): JSX.Element => {
  const [language, setLanguage] = useState<string>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only access localStorage on the client side
    if (isBrowser) {
      const savedLanguage = localStorage.getItem("language") || "en";
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: string): void => {
    setLanguage(lang);
    // Only access localStorage on the client side
    if (isBrowser) {
      localStorage.setItem("language", lang);
    }
  };

  // Enhanced translation function with nested key support
  const t = (key: string, options?: { returnObjects?: boolean }): any => {
    // During SSR, always return English fallback to prevent hydration mismatch
    if (!isClient) {
      const keys = key.split(".");
      let value: any = translations["en"];

      for (const k of keys) {
        if (value && typeof value === "object") {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      return value || key;
    }

    // Client-side translation
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
