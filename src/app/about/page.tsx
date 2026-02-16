'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  User,
  TrendingUp,
  Code,
  Edit3,
  Globe,
  Target,
  Heart,
  Lightbulb,
  Users,
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function About() {
  const { t } = useLanguage();

  const journey = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community Leadership",
      period: "20+ Years",
      description: "Built elite soft skills as Pastor and Community Leader: empathy, communication, crisis management, and understanding human needs."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "World Champion",
      period: "2x World Titles",
      description: "Brazilian Jiu-Jitsu World Champion demonstrating discipline, focus, and performance under pressure—skills that translate directly to product development."
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Product Engineering",
      period: "Present",
      description: "Full Stack Product Engineer combining technical expertise with deep understanding of user psychology and business strategy."
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Base Logic Labs",
      period: "Founder",
      description: "Leading studio that bridges Silicon Valley engineering with sales psychology, serving global clients from New Zealand."
    }
  ];

  const services = [
    {
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "Custom SaaS Development",
      description: "End-to-end MVP building using the T3 Stack or Next.js ecosystem. Focus on Vertical SaaS for niche industries.",
      features: [
        "Full-Stack Next.js Applications",
        "PostgreSQL Database Architecture",
        "Stripe & Payment Integration",
        "Role-Based Access Control (RBAC)",
        "API Design & Development",
        "Scalable Cloud Infrastructure"
      ]
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-green-600" />,
      title: "AI & Automation Integration",
      description: "Implementing LLMs (OpenAI/Anthropic) for RAG pipelines, chatbots, and automated business workflows.",
      features: [
        "Custom AI Chatbots",
        "RAG Pipeline Development",
        "Business Process Automation",
        "OpenAI & Anthropic Integration",
        "Intelligent Document Processing",
        "AI-Enhanced User Experiences"
      ]
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Conversion-Driven UI/UX",
      description: "Auditing and rebuilding interfaces specifically to increase user retention and sales by combining code with copywriting psychology.",
      features: [
        "Conversion Rate Optimization",
        "Psychology-Driven Design",
        "A/B Testing Implementation",
        "User Journey Mapping",
        "Persuasive Copywriting",
        "Analytics & Performance Tracking"
      ]
    }
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Business-First Mindset",
      description: "Every technical decision is a business decision. I build solutions that drive measurable ROI and solve real problems."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Global Perspective",
      description: "Experience across NZ, Brazil, and USA means I understand diverse markets and can work seamlessly with international teams."
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      title: "Product Excellence",
      description: "Combining technical expertise with psychology and pedagogy to create products that people actually want to use."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium px-4 py-2">
              About Base Logic Labs
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
              The Man Behind{" "}
              <span className="text-blue-600">The Code</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Full Stack Product Engineer meets 20+ years of leadership experience and world-class discipline
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">My Journey</h2>
              <p className="text-lg text-muted-foreground">From community leadership to world-class product engineering</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {journey.map((step, index) => (
                <Card key={index} className="border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {step.icon}
                    </div>
                    <CardTitle className="text-lg text-foreground">{step.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">{step.period}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-6 border-2 border-blue-200">
                    <img 
                      src="/images/isma-profile21.jpg" 
                      alt="Ismael Silva - Founder of Base Logic Labs" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Ismael Silva</h3>
                    <p className="text-lg text-blue-600">Founder & Product Engineer</p>
                  </div>
                </div>
                
                <div className="prose prose-lg text-muted-foreground leading-relaxed">
                  <h4 className="text-xl font-bold text-foreground mb-4">From Community Leader to Product Engineer</h4>
                  
                  <p className="mb-4">
                    I'm not your typical developer. Before writing my first line of code, I spent <strong>20 years as a Pastor and Community Leader</strong>, developing elite soft skills that most engineers never acquire: empathy, communication, crisis management, and the ability to understand what people truly need—not just what they say they want.
                  </p>
                  
                  <p className="mb-4">
                    This unique background gives me an <strong>unfair advantage</strong> in product engineering. I don't just build features—I architect solutions that solve real human problems. My time leading communities taught me how to identify pain points, manage stakeholder expectations, and deliver results under pressure.
                  </p>
                  
                  <h4 className="text-xl font-bold text-foreground mb-4 mt-6">The Product Mindset</h4>
                  
                  <p className="mb-4">
                    To me, <strong>code is a tool to solve human problems</strong>. Every line I write is informed by pedagogy and deep user journey understanding. I approach development with the same care I brought to helping people navigate life's challenges—with empathy, strategic thinking, and a focus on outcomes.
                  </p>
                  
                  <h4 className="text-xl font-bold text-foreground mb-4 mt-6">Discipline Under Pressure</h4>
                  
                  <p className="mb-4">
                    I'm also a <strong>2x World Brazilian Jiu-Jitsu Champion</strong>. This isn't just a cool fact—it demonstrates discipline, focus, and the ability to perform under immense pressure. In both BJJ and product development, success comes from strategy, persistence, and the mental toughness to push through when things get difficult.
                  </p>
                  
                  <h4 className="text-xl font-bold text-foreground mb-4 mt-6">Global Perspective, Remote Ready</h4>
                  
                  <p>
                    Having lived and worked in <strong>New Zealand, Brazil, and the United States</strong>, I bring a truly global perspective to every project. I'm comfortable working across time zones and cultures, making me the ideal technical partner for distributed teams and international projects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What I Build</h2>
              <p className="text-lg text-muted-foreground">Specialized solutions that combine technical excellence with business strategy</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                  <CardHeader className="text-center flex-shrink-0">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    <div className="space-y-2 mt-auto">
                      {Array.isArray(service.features) && service.features.map((feature: string, featureIndex: number) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Core Values</h2>
              <p className="text-lg text-muted-foreground">The principles that guide everything I build</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border hover:shadow-2xl transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Let's Build Something Exceptional</h2>
                <p className="text-xl mb-8 text-blue-100">
                  Ready to work with a Product Engineer who understands both code and business strategy?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg" variant="secondary" className="bg-card text-primary hover:bg-muted border border-border w-full">
                      Book Strategy Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button size="lg" variant="secondary" className="bg-card text-primary hover:bg-muted border border-border w-full">
                      View Portfolio
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
