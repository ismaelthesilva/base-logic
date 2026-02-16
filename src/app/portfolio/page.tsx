'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Code, Zap, Target, TrendingUp, Globe, Star, BookOpen, PenTool, Rocket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Software & SaaS Projects (Tab 1)
const softwareSaasProjects = [
  {
    name: "BJJChamp Platform",
    url: "https://bjjchamp.net",
    image: "/images/bjjchampHome.png", 
    category: "Vertical SaaS Platform",
    description: "Complete Brazilian Jiu-Jitsu ecosystem serving 10K+ monthly users. Features athlete profiles, competition tracking, and fan engagement with sophisticated role-based access control.",
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe', 'RBAC'],
    highlights: ['Role-Based Access Control', 'Stripe Subscriptions', 'Real-time data sync', 'Scalable architecture'],
    results: "Handles 10K+ monthly active users with 99.9% uptime",
    impact: "🏆 Vertical SaaS platform for niche sports industry with subscription model",
    technicalFocus: "Scalable database architecture, complex authentication flows, payment processing"
  },
  {
    name: "Jackie Souto Academy",
    url: "https://jackiesouto.com",
    image: "/images/jackieHome.png",
    category: "SaaS Platform",
    description: "Full-featured academy management platform with course delivery, payment processing, and student management. Generates $50K+ in annual recurring revenue.",
    technologies: ['Next.js', 'Stripe API', 'Video CDN', 'Authentication', 'PostgreSQL'],
    highlights: ['Course management', 'Subscription billing', 'Video streaming', 'Student dashboard'],
    results: "$50K+ in direct sales, 300+ active students",
    impact: "💰 Complete academy management SaaS solution",
    technicalFocus: "Payment gateway integration, content delivery optimization, user role management"
  },
  {
    name: "Soute Doces E-commerce",
    url: "https://soutedoces.com",
    image: "/images/souteDocesHome.png",
    category: "E-commerce Platform",
    description: "High-performance e-commerce platform optimized for low-bandwidth environments. Achieves 90+ Lighthouse scores with complex inventory management.",
    technologies: ['React', 'Node.js', 'Payment Gateway', 'Optimization', 'CDN'],
    highlights: ['90+ Lighthouse score', 'Low-bandwidth optimized', 'Inventory management', 'Analytics'],
    results: "180% increase in sales, 60% faster order processing",
    impact: "🛒 Performance-optimized for emerging markets",
    technicalFocus: "Performance optimization, image compression, progressive loading, caching strategies"
  }
];

// Growth & Strategy Projects (Tab 2)
const growthStrategyProjects = [
  {
    name: "Arda Project Book Series",
    image: "/images/bjjchamp-nz.png",
    category: "Editorial Product Launch",
    description: "Complete go-to-market strategy for book trilogy launch on Amazon KDP. SEO optimization, cover design strategy, and multi-platform launch coordination.",
    strategyFocus: ['Amazon KDP SEO', 'Product trilogy management', 'Launch coordination', 'Multi-platform strategy'],
    copywritingApproach: "Category positioning, keyword optimization, compelling book descriptions",
    results: "Successfully launched 3-book series with optimized Amazon rankings",
    impact: "📚 Complete editorial product launch and go-to-market strategy",
    businessValue: "Product strategy, market positioning, SEO optimization"
  },
  {
    name: "High-Conversion Funnels",
    url: "https://bjjchamp.net/bjjmentoria",
    image: "/images/bjjmentoria.png",
    category: "VSL & Landing Page Architecture",
    description: "Psychology-driven VSL and landing page system achieving 12.5% conversion rates (3x industry average). Generated $65K+ in revenue through strategic funnel design.",
    strategyFocus: ['VSL scripting', 'Landing page psychology', 'Conversion optimization', 'CAC reduction'],
    copywritingApproach: "Story-driven sales, emotional triggers, objection handling, urgency creation",
    results: "12.5% conversion rate, $65K+ revenue, 8.7% video-to-sale conversion",
    impact: "📈 Psychology-focused conversion engineering",
    businessValue: "Customer acquisition cost reduction, conversion rate optimization, sales psychology"
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 md:px-0">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Portfolio</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Work That Delivers Results
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            From scalable SaaS platforms to high-conversion marketing funnels — 
            explore projects that combine technical excellence with business strategy
          </p>
        </div>

        {/* Tabs Strategy Implementation */}
        <Tabs defaultValue="software" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="software" className="text-lg py-3">
              <Code className="h-5 w-5 mr-2" />
              Software & SaaS
            </TabsTrigger>
            <TabsTrigger value="growth" className="text-lg py-3">
              <TrendingUp className="h-5 w-5 mr-2" />
              Growth & Strategy
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Software & SaaS */}
          <TabsContent value="software" className="mt-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Software & SaaS Projects</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Focus: Code, Architecture, Performance, Stack. Building scalable platforms that serve thousands of users.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {softwareSaasProjects.map((project) => (
                <div key={project.name} className="bg-card rounded-xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img src={project.image} alt={project.name} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    
                    {/* Technologies */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-blue-600">Tech Stack:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-green-600">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.highlights.map((feature) => (
                          <span key={feature} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Technical Focus */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-purple-700 dark:text-purple-300">🔧 Technical Focus:</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">{project.technicalFocus}</p>
                    </div>

                    {/* Results */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-blue-700 dark:text-blue-300">📊 Results:</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{project.results}</p>
                    </div>

                    {/* Impact */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-6">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{project.impact}</p>
                    </div>

                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Growth & Strategy */}
          <TabsContent value="growth" className="mt-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Growth & Strategy Projects</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Focus: Copywriting, VSLs, Book Launches, SEO. Strategic work that drives revenue and business growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {growthStrategyProjects.map((project) => (
                <div key={project.name} className="bg-card rounded-xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img src={project.image} alt={project.name} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    
                    {/* Strategy Focus */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-orange-600">Strategy Focus:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.strategyFocus.map((focus) => (
                          <span key={focus} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded text-sm">
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Copywriting Approach */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-purple-700 dark:text-purple-300">✍️ Copywriting Approach:</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">{project.copywritingApproach}</p>
                    </div>

                    {/* Business Value */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-blue-700 dark:text-blue-300">💼 Business Value:</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{project.businessValue}</p>
                    </div>

                    {/* Results */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm text-green-700 dark:text-green-300">💰 Revenue Impact:</h4>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">{project.results}</p>
                    </div>

                    {/* Impact */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-6">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{project.impact}</p>
                    </div>

                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        View Campaign
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <section className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Build Your Next Project?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Whether you need a scalable SaaS platform or a high-conversion marketing funnel, 
              let's create something exceptional together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Let's Work Together
              </Link>
              <Link 
                href="/services" 
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-colors font-bold text-lg"
              >
                View Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
