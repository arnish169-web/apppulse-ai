"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartLineUp,
  Bell,
  ChartBar,
  ListChecks,
  Envelope,
  Square,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Pulse,
  Target,
  Brain,
  List,
} from "@phosphor-icons/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: ChartLineUp,
      title: "Ranking Tracker",
      description: "Weekly digest of your keyword positions vs. top 10 competitors. Trend indicators show gains and losses at a glance.",
    },
    {
      icon: Bell,
      title: "Competitor Alerts",
      description: "Real-time email when a competitor jumps 5+ positions or launches a new app in your category.",
    },
    {
      icon: ChartBar,
      title: "Sentiment Analysis",
      description: "Reviews categorized as Feature Requests, Bug Reports, Praise, or Complaints — automatically, every week.",
    },
    {
      icon: ListChecks,
      title: "Strategic Playbook",
      description: "Monthly AI-generated report with 2-3 prioritized recommendations based on competitor moves + your review trends.",
    },
    {
      icon: Envelope,
      title: "Weekly Digest",
      description: "Rich HTML email every Monday morning with everything that matters — no dashboard required.",
    },
    {
      icon: Square,
      title: "Real-time Dashboard",
      description: "Mobile-responsive web UI with your rankings, alerts timeline, and current Playbook — anywhere, anytime.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Target,
      title: "Watch",
      description: "Tell us your app and up to 3 competitors. We scrape the Shopify App Store daily for ranking changes and new reviews.",
    },
    {
      number: "02",
      icon: Bell,
      title: "Detect",
      description: "Our AI spots ranking swings, review sentiment shifts, and new competitor releases the moment they happen.",
    },
    {
      number: "03",
      icon: Brain,
      title: "Act",
      description: "Every week, get a 3-item Playbook: what changed, what competitors did, and exactly what to build next.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "49",
      description: "For solo developers getting started",
      features: [
        "1 app",
        "10 keywords",
        "5 competitors",
        "Weekly digest",
        "Monthly Playbook",
        "Email alerts (>10 position change)",
      ],
      cta: "Join Beta",
      popular: false,
    },
    {
      name: "Growth",
      price: "149",
      description: "For growing teams scaling their presence",
      features: [
        "3 apps",
        "25 keywords",
        "15 competitors",
        "Daily snapshots",
        "Weekly digest",
        "Monthly Playbook",
        "Real-time alerts on any change",
        "Full dashboard access",
        "Exportable reports",
      ],
      cta: "Join Beta",
      popular: true,
    },
    {
      name: "Studio",
      price: "299",
      description: "For agencies and serious operators",
      features: [
        "Unlimited apps",
        "Unlimited keywords",
        "Unlimited competitors",
        "Everything in Growth",
        "Quarterly Strategy Call (recorded)",
        "Slack integration option",
        "Private Discord access",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-deep-space text-text-primary font-jakarta">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-deep-space/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-signal-indigo flex items-center justify-center">
              <Pulse className="w-5 h-5 text-white" weight="bold" />
            </div>
            <span className="font-sora font-bold text-xl text-text-primary">AppPulse AI</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
            <Button size="sm">Join Beta</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-deep-space border-b border-border p-4 flex flex-col gap-4">
            <a href="#features" className="text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Button size="sm">Join Beta</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-accent-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-signal-indigo/10 border border-signal-indigo/30 text-signal-indigo text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-pulse-emerald animate-pulse" />
              Now in Beta — 15 Shopify app developers joined
            </div>

            {/* Headline */}
            <h1 className="font-sora font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Don&apos;t wake up to a{" "}
              <span className="text-gradient">50% ranking drop.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed">
              AppPulse monitors your competitors 24/7 — surfacing the 3 shifts that matter before they cost you revenue.
            </p>

            {/* CTA Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-4">
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72 h-12"
                  required
                />
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Join Beta — Free"}
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-pulse-emerald font-medium mb-4">
                <Check className="w-5 h-5" />
                <span>You&apos;re on the list! We&apos;ll be in touch soon.</span>
              </div>
            )}

            <p className="text-sm text-text-secondary">
              5 keywords • 3 competitors • 30 days free • No credit card
            </p>
          </div>

          {/* Hero Visual - Dashboard Mockup */}
          <div className="relative animate-float hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-b from-signal-indigo/20 to-transparent rounded-2xl blur-3xl" />
            <div className="relative bg-surface border border-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-coral-red" />
                <div className="w-3 h-3 rounded-full bg-alert-amber" />
                <div className="w-3 h-3 rounded-full bg-pulse-emerald" />
              </div>
              
              {/* Mock ranking table */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Keyword: &quot;Email Marketing&quot;</div>
                {[
                  { rank: 1, app: "Klaviyo", change: "+2", positive: true },
                  { rank: 2, app: "Mailchimp", change: "-1", positive: false },
                  { rank: 3, app: "Cmboost", change: "+5", positive: true },
                  { rank: 4, app: "Email2Go", change: "+1", positive: true },
                  { rank: 5, app: "Seguno", change: "-3", positive: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-text-secondary w-6">{item.rank}</span>
                      <span className="font-medium">{item.app}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${item.positive ? "text-pulse-emerald" : "text-coral-red"}`}>
                      {item.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {item.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert badge */}
              <div className="mt-4 p-3 bg-coral-red/10 border border-coral-red/30 rounded-lg">
                <div className="flex items-center gap-2 text-coral-red text-sm">
                  <Bell className="w-4 h-4" weight="fill" />
                  <span className="font-medium">Your app dropped from #3 to #8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-text-secondary text-sm mb-6">Trusted by developers building top Shopify apps</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-24 h-8 bg-border rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sora font-bold text-3xl md:text-4xl mb-4">How It Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Three steps from data chaos to actionable intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-8 bg-surface border border-border rounded-xl hover:border-signal-indigo/30 transition-all">
                <div className="text-6xl font-sora font-bold text-signal-indigo/20 mb-4">{step.number}</div>
                <div className="w-12 h-12 rounded-lg bg-signal-indigo/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-signal-indigo" />
                </div>
                <h3 className="font-sora font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sora font-bold text-3xl md:text-4xl mb-4">Everything You Need to Stay Ahead</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From raw data to actionable insights — all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="p-6 bg-surface border border-border rounded-xl hover:border-signal-indigo/30 hover:shadow-lg hover:shadow-signal-indigo/5 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-signal-indigo/10 flex items-center justify-center mb-4 group-hover:bg-signal-indigo/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-signal-indigo" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,847", label: "Ranking changes detected this week" },
              { value: "18", label: "New apps tracked" },
              { value: "94%", label: "Alert accuracy" },
              { value: "15", label: "Beta users and growing" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-sora font-bold text-3xl md:text-4xl text-signal-indigo mb-2">{stat.value}</div>
                <div className="text-text-secondary text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sora font-bold text-3xl md:text-4xl mb-4">Simple, Transparent Pricing</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card key={i} className={`relative ${plan.popular ? "border-signal-indigo shadow-lg shadow-signal-indigo/10" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-signal-indigo text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-sora">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="font-sora font-bold text-4xl">${plan.price}</span>
                    <span className="text-text-secondary">/mo</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-pulse-emerald mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? "primary" : "secondary"}>
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="text-center text-text-secondary text-sm mt-8">
            All plans include 30-day free beta. No credit card required.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-surface/50 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-sora font-bold text-3xl md:text-4xl mb-4">Start protecting your rankings today.</h2>
          <p className="text-text-secondary text-lg mb-8">
            Join 15 developers already on the waitlist.
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-80 h-12"
                required
              />
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Joining..." : "Join Beta — It&apos;s Free"}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-pulse-emerald font-medium">
              <Check className="w-5 h-5" />
              <span>You&apos;re on the list!</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-signal-indigo flex items-center justify-center">
              <Pulse className="w-5 h-5 text-white" weight="bold" />
            </div>
            <span className="font-sora font-bold text-lg">AppPulse AI</span>
          </div>
          <p className="text-text-secondary text-sm">
            © 2025 AppPulse AI. &quot;Ranking Protection for Your App Revenue.&quot;
          </p>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <span className="hover:text-text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">@apppulseai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}