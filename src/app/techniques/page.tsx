"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Code2,
  PenTool,
  Target,
  Zap,
  TrendingUp,
  Users,
  Eye,
  Heart,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart,
} from "lucide-react";

export default function Techniques() {
  const { t } = useLanguage();

  const techniques = [
    {
      category: "Copywriting",
      icon: <PenTool className="h-8 w-8 text-blue-600" />,
      techniques: [
        {
          name: "AIDA Framework",
          description:
            "Attention, Interest, Desire, Action - the classic conversion formula",
          icon: <Target className="h-5 w-5" />,
        },
        {
          name: "PAS Formula",
          description:
            "Problem, Agitation, Solution - perfect for pain-point marketing",
          icon: <Zap className="h-5 w-5" />,
        },
        {
          name: "Storytelling",
          description: "Emotional connection through compelling narratives",
          icon: <Heart className="h-5 w-5" />,
        },
        {
          name: "Social Proof",
          description:
            "Leveraging testimonials and case studies for credibility",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      category: "Development",
      icon: <Code2 className="h-8 w-8 text-green-600" />,
      techniques: [
        {
          name: "Performance Optimization",
          description:
            "Techniques for lightning-fast loading times and better UX",
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          name: "Conversion Tracking",
          description: "Advanced analytics setup for measuring what matters",
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          name: "A/B Testing",
          description: "Data-driven optimization for maximum conversions",
          icon: <Eye className="h-5 w-5" />,
        },
        {
          name: "Progressive Enhancement",
          description: "Building resilient experiences that work everywhere",
          icon: <Lightbulb className="h-5 w-5" />,
        },
      ],
    },
    {
      category: "Strategy",
      icon: <Target className="h-8 w-8 text-purple-600" />,
      techniques: [
        {
          name: "Customer Journey Mapping",
          description:
            "Understanding every touchpoint in your customer's experience",
          icon: <ArrowRight className="h-5 w-5" />,
        },
        {
          name: "Funnel Optimization",
          description:
            "Maximizing conversions at every stage of the sales process",
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          name: "Persona Development",
          description: "Creating detailed profiles of your ideal customers",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Value Proposition Design",
          description:
            "Crafting compelling reasons why customers should choose you",
          icon: <Target className="h-5 w-5" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 text-sm font-medium px-4 py-2"
            >
              🎯 Proven Methods
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              Techniques That{" "}
              <span className="text-blue-600">Drive Results</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Discover the proven strategies, frameworks, and methodologies we
              use to transform businesses and maximize conversions.
            </p>
          </div>
        </div>
      </section>

      {/* Techniques Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-16">
            {techniques.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                {/* Category Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center shadow-lg">
                      {category.icon}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    {category.category} Techniques
                  </h2>
                </div>

                {/* Techniques Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.techniques.map((technique, techniqueIndex) => (
                    <Card
                      key={techniqueIndex}
                      className="border border-border shadow-xl bg-card/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group"
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue-100 transition-colors duration-200">
                          {technique.icon}
                        </div>
                        <CardTitle className="text-lg text-slate-900">
                          {technique.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 leading-relaxed text-center">
                          {technique.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why These Techniques Work */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-border shadow-xl bg-card/70 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Why These Techniques Work
                  </h2>
                  <p className="text-lg text-slate-600">
                    Based on psychology, data, and years of real-world testing
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      Psychology-Based
                    </h3>
                    <p className="text-sm text-slate-600">
                      Rooted in human psychology and behavioral science
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      Data-Driven
                    </h3>
                    <p className="text-sm text-slate-600">
                      Continuously tested and optimized based on real metrics
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      Proven Results
                    </h3>
                    <p className="text-sm text-slate-600">
                      Used successfully across hundreds of projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Apply These Techniques?
                </h2>
                <p className="text-xl mb-8 text-blue-100">
                  Let's implement these proven strategies to transform your
                  business results
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-background text-blue-600 hover:bg-accent"
                  >
                    Schedule Strategy Call
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    View Case Studies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
