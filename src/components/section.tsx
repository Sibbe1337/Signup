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
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10 px-4 py-16">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="font-heading text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            MoodTunes
          </h1>
          <p className="text-2xl font-heading">Your AI-Powered Music Discovery Platform</p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect soundtrack for your videos, games, and stories with our intelligent
            music recommendation engine.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/f8835ec5b1e556e6e955e03887da845c.gif"
              alt="MoodTunes Platform Preview"
              width={800}
              height={800}
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              placeholder="blur"
              className="object-cover"
            />
            <div className="w-full max-w-md mx-auto p-6">
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-heading font-bold">Subscribe to our newsletter</h2>
                  <p className="text-sm text-muted-foreground">
                    Get the latest updates directly in your inbox
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-email">Email address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="your@email.com"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        disabled={isNewsletterLoading}
                        required
                      />
                      <Button type="submit" disabled={isNewsletterLoading}>
                        {isNewsletterLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Subscribe
                      </Button>
                    </div>
                  </div>
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
                </div>
              </form>
            </div>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Sign up for Early Access
                </Button>
              </form>
            </Card>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">AI-Powered Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Smart Playlists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Easy Licensing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Creator Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
