"use client";

import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === "en" ? "pt" : "en";
    changeLanguage(newLang);
  };

  const isPortuguese = language === "pt";

  return (
    <div
      className={`flex items-center gap-2 p-1 rounded-full transition-colors duration-300 ${
        isPortuguese ? "bg-green-100" : "bg-blue-100"
      }`}
    >
      <img
        src="https://flagcdn.com/br.svg"
        alt="Brazil"
        className={`w-5 h-5 rounded-full transition-all duration-300 ${
          isPortuguese
            ? "opacity-100 scale-110 shadow-lg"
            : "opacity-50 scale-100"
        }`}
      />
      <label className="relative inline-block w-12 h-7 cursor-pointer">
        <input
          type="checkbox"
          checked={!isPortuguese}
          onChange={toggleLanguage}
          className="opacity-0 w-0 h-0"
        />
        <div
          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 shadow-inner ${
            isPortuguese ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          <div
            className={`absolute content-[''] h-5 w-5 left-1 bottom-1 bg-white rounded-full transition-transform duration-300 shadow-md ${
              isPortuguese ? "transform-none" : "transform translate-x-5"
            }`}
          ></div>
        </div>
      </label>
      <img
        src="https://flagcdn.com/us.svg"
        alt="USA"
        className={`w-5 h-5 rounded-full transition-all duration-300 ${
          !isPortuguese
            ? "opacity-100 scale-110 shadow-lg"
            : "opacity-50 scale-100"
        }`}
      />
    </div>
  );
};

export default LanguageSwitcher;
