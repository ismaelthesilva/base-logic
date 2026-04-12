"use client";

import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
      <button
        onClick={() => changeLanguage("en")}
        title="English"
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
          language === "en"
            ? "ring-2 ring-indigo-500 shadow-sm"
            : "grayscale opacity-40 hover:opacity-60"
        }`}
      >
        <img
          src="https://flagcdn.com/us.svg"
          alt="English"
          className="w-5 h-5 rounded-full object-cover"
        />
      </button>
      <button
        onClick={() => changeLanguage("pt")}
        title="Português"
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
          language === "pt"
            ? "ring-2 ring-green-500 shadow-sm"
            : "grayscale opacity-40 hover:opacity-60"
        }`}
      >
        <img
          src="https://flagcdn.com/br.svg"
          alt="Português"
          className="w-5 h-5 rounded-full object-cover"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
