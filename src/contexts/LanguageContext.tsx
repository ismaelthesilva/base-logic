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

export const useLanguage = (): LanguageContextType => {
  // Create default fallback function
  const defaultT = (
    key: string,
    options?: { returnObjects?: boolean }
  ): any => {
    // Provide basic fallback translations for common keys
    const fallbacks: Record<string, any> = {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.portfolio": "Portfolio",
      "nav.contact": "Contact",
      "nav.services": "Services",
      "hero.badge": "🔥 Converting 3x Better Than Industry Average",
      "hero.title": "Turn Your Traffic Into",
      "hero.titleHighlight": "Paying Customers",
    };

    return fallbacks[key] || key;
  };

  // Default return object
  const defaultReturn: LanguageContextType = {
    language: "en",
    changeLanguage: () => {},
    t: defaultT,
  };

  // During SSR, return default values immediately
  if (!isBrowser) {
    return defaultReturn;
  }

  try {
    const context = useContext(LanguageContext);
    // If context is available, return it; otherwise return default
    return context || defaultReturn;
  } catch (error) {
    // If useContext fails (during SSR), return default
    return defaultReturn;
  }
};

const translations: Record<string, any> = {
  en: enTranslations,
  pt: ptTranslations,
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
