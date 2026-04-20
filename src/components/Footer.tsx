"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-slate-900 dark:bg-slate-950 text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t("footer.title")}
        </h3>
        <p className="text-slate-300 dark:text-slate-400 mb-6">
          {t("footer.description")}
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/contact"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t("footer.links.contact")}
          </Link>
          <Link
            href="/about"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t("footer.links.about")}
          </Link>
          <Link
            href="/portfolio"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t("footer.links.portfolio")}
          </Link>
        </div>
      </div>
    </section>
  );
}
