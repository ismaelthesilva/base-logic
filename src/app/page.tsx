"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  TrendingUp,
  Users,
  Zap,
  Target,
  FileText,
  Video,
  Image as ImageIcon,
  Globe,
  Code,
} from "lucide-react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // Safely use language context with fallback
  let t = (key: string) => key; // Default fallback
  try {
    const context = useLanguage();
    t = context.t;
  } catch (error) {
    // Context not available, use fallback
    console.warn("LanguageContext not available, using fallback");
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  const technologiesStable = [
    {
      name: "Next.js",
      icon: "⚡",
      description: "Production-grade React framework for modern web apps",
    },
    {
      name: "TypeScript",
      icon: "📘",
      description: "Type-safe code for enterprise reliability",
    },
    {
      name: "PostgreSQL",
      icon: "🐘",
      description: "Enterprise database for scalable data architecture",
    },
    {
      name: "Node.js",
      icon: "🟢",
      description: "High-performance server-side JavaScript runtime",
    },
    {
      name: "Tailwind CSS",
      icon: "🎨",
      description: "Utility-first CSS for rapid UI development",
    },
    {
      name: "Prisma + Neon",
      icon: "🗄️",
      description: "Type-safe ORM with serverless Postgres",
    },
    {
      name: "AI Integration",
      icon: "🤖",
      description: "OpenAI & Anthropic APIs for intelligent features",
    },
    {
      name: "Vercel",
      icon: "▲",
      description: "Edge deployment for optimal performance",
    },
  ];

  const services = [
    {
      titleKey: "services.fullStack.title",
      title: "Full Stack Architecture",
      descriptionKey: "services.fullStack.description",
      description:
        "Enterprise-grade web applications built with Next.js, Node.js, and PostgreSQL. Scalable, secure, and optimized for performance.",
      icon: <Code className="h-8 w-8" />,
      featuresKey: "services.fullStack.features",
      features: [
        "Next.js & React",
        "Node.js Backend",
        "PostgreSQL Database",
        "API Design",
      ],
    },
    {
      titleKey: "services.conversion.title",
      title: "Conversion Engineering",
      descriptionKey: "services.conversion.description",
      description:
        "Using psychology to reduce churn and increase user retention. Every interface decision is backed by behavioral science.",
      icon: <Target className="h-8 w-8" />,
      featuresKey: "services.conversion.features",
      features: [
        "Psychology-Driven UX",
        "User Retention Strategies",
        "Conversion Optimization",
        "A/B Testing Framework",
      ],
    },
    {
      titleKey: "services.speed.title",
      title: "Speed to Market",
      descriptionKey: "services.speed.description",
      description:
        "AI-enhanced workflows for rapid MVP delivery. Get to market faster with proven frameworks and automation.",
      icon: <Zap className="h-8 w-8" />,
      featuresKey: "services.speed.features",
      features: [
        "Rapid MVP Development",
        "AI-Enhanced Workflows",
        "Agile Methodology",
        "Continuous Deployment",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Jackie Souto",
      company: "Jackie Souto Academy",
      text: "Ismael built a complete SaaS platform for my academy with payment integration, course management, and user authentication. The technical execution was flawless.",
      result: "300+ Active Students",
    },
    {
      name: "BJJ Championship",
      company: "World BJJ Championships",
      text: "The BJJChamp platform now handles 10K+ monthly users with real-time data and complex role-based permissions. Outstanding product engineering.",
      result: "10K+ Monthly Users",
    },
    {
      name: "Soute Doces",
      company: "E-commerce Platform",
      text: "The performance optimization for our e-commerce platform was incredible. 90+ Lighthouse scores and sales increased by 180%.",
      result: "180% Sales Increase",
    },
  ];

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      suppressHydrationWarning={true}
    >
      {/* Hero Section - Base Logic Labs Branding */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <img
              src="/ismacopyLogo.png"
              alt="Base Logic Labs Logo"
              className="mx-auto mb-6 w-24 h-24 rounded-2xl shadow-lg"
            />
            <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {isClient ? t("hero.title") : "Engineered for Growth"}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 leading-relaxed text-gray-200 font-medium">
              {isClient
                ? t("hero.description")
                : "Base Logic Labs is a specialized studio partnering with global companies to architect scalable web apps that drive measurable business results"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Link href="/portfolio">
                  {isClient ? t("hero.ctaPrimary") : "View Portfolio"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Link href="/contact">
                  {isClient ? t("hero.ctaSecondary") : "Book Strategy Call"}
                </Link>
              </Button>
            </div>
            {/* Social Proof */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>
                    {isClient
                      ? t("hero.socialProof.leadership")
                      : "20+ Years Leadership Experience"}
                  </span>
                </div>
                <div className="hidden sm:block h-6 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span>
                    {isClient
                      ? t("hero.socialProof.champion")
                      : "2x World BJJ Champion"}
                  </span>
                </div>
                <div className="hidden sm:block h-6 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <span>
                    {isClient
                      ? t("hero.socialProof.global")
                      : "3 Countries, 2 Continents"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" suppressHydrationWarning={true}>
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {isClient ? t("services.badge") : "Core Services"}
            </Badge>
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              {isClient ? t("services.title") : "Where Engineering Meets"}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {isClient ? t("services.titleHighlight") : "Business Growth"}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {isClient
                ? t("services.description")
                : "Product engineering that combines technical excellence with business strategy"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-card border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">
                      {isClient ? t(service.titleKey) : service.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-300 text-center">
                    {isClient ? t(service.descriptionKey) : service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(isClient
                      ? (t(service.featuresKey) as unknown as string[])
                      : service.features
                    ).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" suppressHydrationWarning={true}>
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              {isClient ? t("technologies.badge") : "Enterprise-Grade Stack"}
            </Badge>
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              {isClient ? t("technologies.title") : "Enterprise-Grade"}{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {isClient ? t("technologies.titleHighlight") : "Technology"}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {isClient
                ? t("technologies.description")
                : "Modern, scalable, and battle-tested technologies powering Fortune 500 companies"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {technologiesStable.map((tech, index) => (
              <Card
                key={index}
                className="text-center bg-card border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="text-4xl mb-2">{tech.icon}</div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {tech.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    {tech.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" suppressHydrationWarning={true}>
            <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 dark:text-white font-semibold">
              {isClient ? t("testimonials.badge") : "⭐ Testimonials"}
            </Badge>
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
              {isClient ? t("testimonials.title") : "What Our Clients"}{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {isClient
                  ? t("testimonials.titleHighlight")
                  : "Say About Working With Us"}
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="border-2 border-blue-200 dark:border-blue-400">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white font-bold">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-blue-600 dark:text-blue-300 font-medium">
                        {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-200 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold">
                    {testimonial.result}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-bounce"></div>
        </div>

        <div
          className="relative container mx-auto px-4 text-center"
          suppressHydrationWarning={true}
        >
          <Badge className="mb-6 bg-gradient-to-r from-red-500 to-orange-600 text-white animate-pulse">
            {isClient ? t("cta.badge") : "🚀 Ready to Start?"}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-black dark:text-white">
            {isClient ? t("cta.title") : "Ready to Transform Your"}{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {isClient ? t("cta.titleHighlight") : "Business?"}
            </span>
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-slate-600 dark:text-slate-300">
            {isClient
              ? t("cta.description")
              : "Get started today and transform your business with proven digital marketing strategies that deliver real results."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 text-white font-bold text-lg px-8 py-4 shadow-2xl hover:shadow-red-500/25 transition-all duration-300"
            >
              {isClient ? t("cta.button") : "Get Started Now"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {isClient ? t("cta.urgency") : "Limited time offer - Act now!"}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-300">
            {(isClient
              ? (t("cta.guarantees") as unknown as string[])
              : [
                  "30-day money-back guarantee",
                  "24/7 support",
                  "Results in 30 days",
                ]
            ).map((guarantee: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                <span>{guarantee}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
