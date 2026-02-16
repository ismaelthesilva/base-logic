'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Code2, 
  PenTool, 
  TrendingUp, 
  Zap, 
  Target, 
  Globe, 
  CheckCircle,
  Star,
  Users,
  DollarSign,
  Clock,
  Shield,
  Rocket,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const services = [
  {
    icon: <Code2 className="h-12 w-12 text-blue-600" />,
    title: "Custom SaaS Development",
    subtitle: "Vertical SaaS. Built to Scale.",
    description: "End-to-end MVP building using the T3 Stack or Next.js ecosystem. Specialized in Vertical SaaS solutions for niche industries with proven frameworks.",
    features: [
      "Next.js & React Applications",
      "PostgreSQL Database Architecture", 
      "Role-Based Access Control (RBAC)",
      "Stripe Payment Integration",
      "RESTful API Design",
      "Cloud Deployment (Vercel/AWS)"
    ],
    deliverables: [
      "Production-ready MVP with scalable architecture",
      "Comprehensive API documentation",
      "Admin dashboard with analytics",
      "Automated testing and CI/CD pipeline"
    ],
    investment: "Starting at $8,000",
    timeline: "4-8 weeks",
    results: "Scalable platforms handling 10K+ users with 99.9% uptime"
  },
  {
    icon: <Zap className="h-12 w-12 text-purple-600" />,
    title: "AI & Automation Integration",
    subtitle: "Intelligent Workflows.",
    description: "Implementing LLMs (OpenAI/Anthropic) for RAG pipelines, chatbots, and automated business workflows that save time and increase efficiency.",
    features: [
      "Custom AI Chatbots",
      "RAG Pipeline Development",
      "OpenAI & Anthropic APIs", 
      "Business Process Automation",
      "Document Intelligence",
      "AI-Enhanced User Experiences"
    ],
    deliverables: [
      "Production-ready AI integrations",
      "Custom-trained models for your data",
      "Automated workflow implementations",
      "Performance monitoring and optimization"
    ],
    investment: "Starting at $6,000",
    timeline: "3-6 weeks",
    results: "60% reduction in manual tasks, 3x faster customer support"
  },
  {
    icon: <Target className="h-12 w-12 text-green-600" />,
    title: "Conversion-Driven UI/UX",
    subtitle: "Psychology Meets Code.",
    description: "Auditing and rebuilding interfaces specifically to increase user retention and sales. Combining engineering excellence with copywriting psychology.",
    features: [
      "Conversion Rate Optimization",
      "Psychology-Driven Design",
      "A/B Testing Framework",
      "User Journey Mapping",
      "Persuasive Copywriting",
      "Analytics & Heat Mapping"
    ],
    deliverables: [
      "Complete UI/UX audit with actionable insights",
      "Redesigned high-converting interfaces",
      "A/B testing implementation and analysis",
      "Conversion-optimized copy and CTAs"
    ],
    investment: "Starting at $4,500",
    timeline: "2-4 weeks",
    results: "Average 150% increase in conversion rates within 60 days"
  }
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Strategy",
    description: "Deep dive into your business, target audience, and goals to create a custom roadmap for success.",
    duration: "1 week"
  },
  {
    step: "02", 
    title: "Design & Development",
    description: "Build your solution using proven frameworks and conversion-focused design principles.",
    duration: "2-4 weeks"
  },
  {
    step: "03",
    title: "Launch & Optimize",
    description: "Deploy your project with comprehensive testing, then continuously optimize for maximum results.",
    duration: "1 week + ongoing"
  }
];

const testimonials = [
  {
    name: "Jackie Souto",
    role: "BJJ World Champion & Coach",
    company: "Jackie Souto Academy",
    quote: "Ismael built a complete SaaS platform for my academy with payment integration, course management, and user authentication. His understanding of both the technical side and business strategy was invaluable.",
    results: "Full-featured academy platform with 300+ active students",
    image: "/images/bjjstory-usa.png"
  },
  {
    name: "BJJ Championship",
    role: "Event Organizer",
    company: "World BJJ Championships",
    quote: "The BJJChamp platform Ismael architected now handles 10K+ monthly users with real-time data and complex role-based permissions. His product engineering mindset made all the difference.",
    results: "Scalable platform serving 10K+ users monthly",
    image: "/images/bjjchamp-nz.png"
  }
];

const guarantees = [
  {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "100% Satisfaction Guarantee",
    description: "If you're not completely satisfied with the results, I'll work for free until you are—or refund your investment."
  },
  {
    icon: <Clock className="h-8 w-8 text-green-600" />,
    title: "On-Time Delivery",
    description: "Your project will be delivered on schedule, or you get 20% off your investment. No excuses, no delays."
  },
  {
    icon: <Rocket className="h-8 w-8 text-purple-600" />,
    title: "Performance Promise",
    description: "Your website will achieve 90+ Lighthouse performance scores and load in under 3 seconds, guaranteed."
  }
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-8">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-600">Services</span>
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Product Engineering
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Specialized solutions that combine Silicon Valley engineering with revenue-focused strategy
            </p>
            
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-4xl mx-auto mb-12 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What Makes Base Logic Labs Different?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="text-blue-600 font-bold text-lg">Technical Excellence</div>
                  <p className="text-sm text-muted-foreground">Enterprise-grade architecture using Next.js, TypeScript, and PostgreSQL</p>
                </div>
                <div className="space-y-2">
                  <div className="text-purple-600 font-bold text-lg">Business Strategy</div>
                  <p className="text-sm text-muted-foreground">20+ years of leadership experience translates to products that drive ROI</p>
                </div>
                <div className="space-y-2">
                  <div className="text-green-600 font-bold text-lg">Conversion Focus</div>
                  <p className="text-sm text-muted-foreground">Psychology-driven design that increases user retention and revenue</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl">
                  <Zap className="mr-2 h-5 w-5" />
                  Book Strategy Call
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Free consultation • Custom solutions • Proven results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-input">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Three Core <span className="text-blue-600">Service Offerings</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each service is designed to solve specific business challenges with measurable results. 
              No cookie-cutter solutions—just proven frameworks tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-6 p-4 bg-muted rounded-2xl w-fit">
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {service.title}
                  </CardTitle>
                  <p className="text-lg font-semibold text-blue-600 mb-4">
                    {service.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  {/* Features */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4">What You Get:</h4>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-4">🎯 Results You'll See:</h4>
                    <div className="space-y-2">
                      {service.deliverables.map((deliverable, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Target className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-blue-800 text-sm">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Timeline */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Investment</p>
                        <p className="text-2xl font-bold text-foreground">{service.investment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Timeline</p>
                        <p className="font-semibold text-foreground">{service.timeline}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <p className="text-sm font-semibold text-green-800">
                        🏆 Proven Results: {service.results}
                      </p>
                    </div>

                    <Link href="/contact" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
                        Get Started Today
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My Proven 3-Step Process
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              From strategy to launch, every step is designed to maximize your results and minimize your stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-background text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-background/30 -z-10"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg opacity-90 mb-4">{step.description}</p>
                <span className="text-sm bg-background/20 px-4 py-2 rounded-full">
                  {step.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-input">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Real Results from Real Clients
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it. Here's what happens when you work with someone who understands both technology and psychology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card shadow-xl border border-border border-0 p-8">
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-bold text-green-800">
                      📊 Result: {testimonial.results}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-20 bg-muted text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My Iron-Clad Guarantees
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              I'm so confident in my ability to deliver results that I put my money where my mouth is.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="bg-background/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-background/10 rounded-2xl w-fit">
                    {guarantee.icon}
                  </div>
                  <CardTitle className="text-xl font-bold mb-4">
                    {guarantee.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center opacity-90 leading-relaxed">
                    {guarantee.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Build Something Exceptional?
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Partner with a Product Engineer who understands both code and business strategy. 
              <strong className="block mt-2">Let's architect your next big win.</strong>
            </p>
            
            <div className="bg-background/10 backdrop-blur-sm p-8 rounded-2xl mb-12">
              <h3 className="text-2xl font-bold mb-6">What You Get</h3>
              <div className="grid md:grid-cols-3 gap-6 text-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span>30-day post-launch support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span>Performance optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span>Strategy consultation</span>
                </div>
              </div>
              <p className="text-sm mt-4 opacity-75">
                Included with every project
              </p>
            </div>

            <div className="space-y-6">
              <Link href="/contact">
                <Button className="bg-background text-blue-600 hover:bg-muted/80 px-12 py-6 text-2xl font-bold rounded-full shadow-2xl">
                  <MessageSquare className="mr-3 h-7 w-7" />
                  Book Strategy Call
                </Button>
              </Link>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm opacity-75">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>30-minute consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>No pressure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Tailored solutions</span>
                </div>
              </div>

              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Let's discuss your project goals and explore how we can build a solution that drives real business results. 
                <strong>Free consultation, no obligations.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}