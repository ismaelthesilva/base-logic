import { Geist, Geist_Mono } from "next/font/google";
import ClientWrapper from "../components/ClientWrapper";
import "./globals.css";
import type { Metadata } from "next";

// This is where you update SEO info, favicon, title, etc.
export const metadata: Metadata = {
  metadataBase: new URL("https://ismaelsilva.com"),
  title: "Base Logic Labs – Product Studio",
  description:
    "Base Logic Labs is a premium product studio bridging Silicon Valley-grade engineering and sales psychology. We architect revenue engines for ambitious SaaS founders and enterprise teams.",
  keywords: [
    "Base Logic Labs",
    "product studio",
    "SaaS",
    "Next.js",
    "React",
    "Tailwind CSS",
    "engineering",
    "sales psychology",
    "enterprise",
    "staff augmentation",
    "product strategy",
    "design",
    "New Zealand",
    "Ismael Silva",
    "global SaaS",
    "vertical SaaS",
    "fitness",
    "BJJ",
    "cloud",
    "AWS",
    "Prisma",
    "PostgreSQL",
    "supabase",
    "multi-language",
    "EN",
    "PT",
    "investment dashboard",
    "secure authentication",
    "UI/UX",
    "portfolio",
    "rapid product launch",
  ],
  authors: [{ name: "Ismael Silva" }],

  // Favicon and icons
  icons: {
    icon: "/ismacopyfavicon.ico",
    apple: "/ismacopyLogo.png",
    shortcut: "/ismacopyfavicon.ico",
  },

  // Open Graph (social media sharing)
  openGraph: {
    title: "Base Logic Labs – Product Studio",
    description:
      "Premium product studio bridging Silicon Valley-grade engineering and sales psychology. We architect revenue engines for SaaS founders and enterprise teams.",
    url: "https://ismaelsilva.com",
    siteName: "Base Logic Labs",
    images: [
      {
        url: "/ismacopyLogo.png",
        width: 1200,
        height: 630,
        alt: "Base Logic Labs - Product Engineering Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Base Logic Labs – Product Studio",
    description:
      "Premium product studio bridging Silicon Valley-grade engineering and sales psychology. Revenue engines for SaaS founders and enterprise teams.",
    images: ["/ismacopyLogo.png"],
    site: "@ismaelsilva",
  },

  // Meta tags
  robots: "index, follow",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  colorScheme: "light dark",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="transition-colors duration-300"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased theme-transition bg-background text-foreground`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
