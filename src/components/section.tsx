"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Mail, Github, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { subscribeToNewsletter, joinWaitlist } from "@/lib/api";

export function Section() {
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          type: 'newsletter',
          marketingConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Subscription successful!",
        description: data.message,
      });
      
      setNewsletterEmail("");
      setMarketingConsent(false);
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWaitlistLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: waitlistEmail,
          type: 'waitlist',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel");
      }

      toast({
        title: "Registrering lyckades!",
        description: data.message,
      });
      
      setWaitlistEmail("");
    } catch (error: any) {
      toast({
        title: "Något gick fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsWaitlistLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10 px-4 py-16">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary md:text-6xl">
            MoodTunes
          </h1>
          <p className="font-heading text-2xl">Your AI-Powered Music Discovery Platform</p>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Find the perfect soundtrack for your videos, games, and stories with our intelligent
            music recommendation engine.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 py-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold">Subscribe to our newsletter</h2>
              <p className="text-muted-foreground">
                Get the latest updates directly in your inbox
              </p>
            </div>
            <Card className="p-6">
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newsletter-email">Email address</Label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={isNewsletterLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isNewsletterLoading}>
                  {isNewsletterLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 size-4" />
                  )}
                  Subscribe
                </Button>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing-consent"
                    checked={marketingConsent}
                    onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                    disabled={isNewsletterLoading}
                  />
                  <Label
                    htmlFor="marketing-consent"
                    className="text-sm text-muted-foreground"
                  >
                    I agree to receive marketing emails
                  </Label>
                </div>
              </form>
            </Card>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-4">
                Coming Soon
              </Badge>
              <h2 className="text-2xl font-heading font-bold">Join the Waitlist</h2>
              <p className="text-muted-foreground">
                Be the first to experience the future of music discovery
              </p>
            </div>
            <Card className="p-6">
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waitlist-email">Email address</Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="your@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    disabled={isWaitlistLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isWaitlistLoading}>
                  {isWaitlistLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 size-4" />
                  )}
                  Sign up for Early Access
                </Button>
              </form>
            </Card>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary size-4" />
                <span className="text-muted-foreground">AI-Powered Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary size-4" />
                <span className="text-muted-foreground">Smart Playlists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary size-4" />
                <span className="text-muted-foreground">Easy Licensing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary size-4" />
                <span className="text-muted-foreground">Creator Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
