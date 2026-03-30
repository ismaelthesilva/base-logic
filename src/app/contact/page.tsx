"use client";

// Disable static generation for this page to avoid context issues
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Mail, Phone, MapPin, Clock, CheckCircle, Send } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Import the language context with SSR safety
  const { t } = useLanguage();

  // Helper function for safe translation access
  const safeT = (key: string, fallback: any = "") => {
    try {
      const result = t(key);
      return result !== key ? result : fallback;
    } catch {
      return fallback;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 text-sm font-medium px-4 py-2"
            >
              💬 {t("contact.title")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="h-full border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {t("contact.form.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          {t("contact.form.name")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-input"
                          placeholder={t("contact.form.namePlaceholder")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          {t("contact.form.email")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-input"
                          placeholder={t("contact.form.emailPlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t("contact.form.phone")}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-input"
                        placeholder={t("contact.form.phonePlaceholder")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t("contact.form.message")}
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-input resize-none"
                        placeholder={t("contact.form.messagePlaceholder")}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {t("contact.form.sending")}
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          {t("contact.form.submit")}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {t("contact.info.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">
                        {t("contact.info.email")}
                      </p>
                      <p className="text-muted-foreground">
                        {t("contact.info.values.email")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">
                        {t("contact.info.phone")}
                      </p>
                      <p className="text-muted-foreground">
                        {t("contact.info.values.phone")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">
                        {t("contact.info.location")}
                      </p>
                      <p className="text-muted-foreground">
                        {t("contact.info.values.location")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">
                        {t("contact.info.availability")}
                      </p>
                      <p className="text-muted-foreground">
                        {t("contact.info.values.availability")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 shadow-xl bg-card/70 backdrop-blur-sm border border-border">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-4">
                    Why Choose Us?
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const features = safeT("contact.features", [
                        "Free initial consultation",
                        "Custom strategy development",
                        "Fast response guaranteed",
                        "Transparent pricing",
                      ]);
                      const featureArray = Array.isArray(features)
                        ? features
                        : [
                            "Free initial consultation",
                            "Custom strategy development",
                            "Fast response guaranteed",
                            "Transparent pricing",
                          ];
                      return featureArray.map(
                        (feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">
                              {feature}
                            </span>
                          </div>
                        )
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
