"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  let t = (key: string) => key;
  try {
    const context = useLanguage();
    t = context.t;
  } catch {}

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-12 bg-slate-900 dark:bg-slate-950 text-white">
      <div
        className="container mx-auto px-4 text-center"
        suppressHydrationWarning={true}
      >
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {isClient ? t("footer.title") : "Let's Work Together"}
        </h3>
        <p className="text-slate-300 dark:text-slate-400 mb-6">
          {isClient
            ? t("footer.description")
            : "Ready to take your business to the next level? Get in touch today."}
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/contact"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isClient ? t("footer.links.contact") : "Contact"}
          </Link>
          <Link
            href="/about"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isClient ? t("footer.links.about") : "Learn More About Us"}
          </Link>
          <Link
            href="/portfolio"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isClient ? t("footer.links.portfolio") : "Portfolio"}
          </Link>
        </div>
      </div>
    </section>
  );
}
