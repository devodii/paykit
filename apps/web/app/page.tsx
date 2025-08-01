import React from 'react';
import { CopyButton } from '@/components/copy-button';
import { ProviderDemo } from '@/components/provider-demo';
import { ThemeToggle } from '@/components/theme-toggle';
import GumroadLogo from '@/public/providers/gumroad.webp';
import PolarLogo from '@/public/providers/polar.jpg';
import StripeLogo from '@/public/providers/stripe.jpeg';
import { Separator, Card, Button, Badge } from '@paykit-sdk/ui';
import { BookOpen, ArrowRight, Zap, Sparkles, Code2, Rocket, Shield, Clock, Users, Check, Terminal, Settings, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const Index = () => {
  return (
    <div className="font-inter bg-background min-h-screen">
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-3">
            <Sparkles className="text-foreground size-4" />
            <span className="text-xl font-bold tracking-tight">PayKit</span>
          </Link>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs">
                <BookOpen className="size-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-12 pb-24">
        {/* Hero Section */}
        <div className="mb-16 space-y-6 text-center">
          <div className="bg-muted/50 inline-flex items-center space-x-2 rounded-full border px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">Open Source Payment Toolkit</span>
            <Badge variant="secondary" className="ml-2">
              TypeScript
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Build payments
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">without vendor lock-in</span>
          </h1>

          <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed md:text-2xl">
            PayKit lets you build billing systems that work locally, then deploy anywhere. Switch providers with a single line of code.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <CopyButton value="npx @paykit-sdk/cli@latest init" variant="outline" size="lg">
              npx @paykit-sdk/cli@latest init
            </CopyButton>
          </div>
        </div>

        {/* Interactive Features Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {/* Local Development */}
          <Card.Root className="group border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
            <Card.Header>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                  <Terminal className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <Card.Title className="text-lg">Local Provider</Card.Title>
              </div>
              <Card.Description>Start building without any payment provider setup</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              {/* Visual representation of local payment testing */}
              <div className="bg-muted/30 relative h-24 rounded-lg p-3">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
                <div className="relative flex h-full flex-col justify-between">
                  {/* Mock payment header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">Test Mode</span>
                    </div>
                    <div className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      MOCK
                    </div>
                  </div>

                  {/* Mock payment transactions */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-3 rounded bg-green-200 dark:bg-green-800"></div>
                        <span className="text-muted-foreground">Payment #1234</span>
                      </div>
                      <span className="font-medium text-green-600">$29.99 ✓</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-3 rounded bg-green-200 dark:bg-green-800"></div>
                        <span className="text-muted-foreground">Webhook received</span>
                      </div>
                      <span className="font-medium text-green-600">200 ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Zero configuration setup</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Mock webhooks & payments</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Full development workflow</span>
                </div>
              </div>
            </Card.Content>
          </Card.Root>

          {/* Provider Switching */}
          <Card.Root className="group border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
            <Card.Header>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Card.Title className="text-lg">Provider Agnostic</Card.Title>
              </div>
              <Card.Description>Switch between Stripe, Polar, or Gumroad instantly</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              {/* Visual representation of providers connecting to PayKit */}
              <div className="bg-muted/30 relative flex h-24 items-center justify-center rounded-lg p-4">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                <div className="relative flex w-full items-center justify-between">
                  {/* Provider logos - overlapping avatars */}
                  <div className="flex items-center">
                    {[
                      { logo: StripeLogo, name: 'Stripe' },
                      { logo: PolarLogo, name: 'Polar' },
                      { logo: GumroadLogo, name: 'Gumroad' },
                    ].map((provider, index) => (
                      <div
                        key={provider.name}
                        className={`border-background h-8 w-8 overflow-hidden rounded-full border-2 ${index > 0 ? '-ml-3' : ''}`}
                      >
                        <Image src={provider.logo} alt={provider.name} width={32} height={32} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Connection line */}
                  <div className="mx-4 flex-1">
                    <div className="h-0.5 w-full bg-gradient-to-r from-blue-400/30 to-blue-400"></div>
                  </div>

                  {/* PayKit core */}
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unified API across all providers</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Switch with single line change</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Zero refactoring needed</span>
                </div>
              </div>
            </Card.Content>
          </Card.Root>

          {/* Production Ready */}
          <Card.Root className="group border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
            <Card.Header>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                  <Rocket className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Card.Title className="text-lg">Production Ready</Card.Title>
              </div>
              <Card.Description>Deploy with confidence using battle-tested patterns</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              {/* Visual representation of production deployment */}
              <div className="bg-muted/30 relative flex h-24 items-center justify-center rounded-lg p-4">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                <div className="relative flex items-center space-x-4">
                  {/* Development */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-gray-300 bg-gray-400">
                      <Code2 className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-muted-foreground text-xs">Dev</div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="text-muted-foreground h-4 w-4" />

                  {/* Production with security shield */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative">
                      <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-purple-300 bg-gradient-to-br from-purple-500 to-pink-600">
                        <Rocket className="h-3 w-3 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                        <Shield className="h-2 w-2 text-white" />
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">Prod</div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="text-muted-foreground h-4 w-4" />

                  {/* Scale */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-muted-foreground text-xs">Scale</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>TypeScript-first with full type safety</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Built-in webhook validation & testing</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Enterprise-grade security patterns</span>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </div>

        {/* Use Cases Section */}
        <div className="mb-16 space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold md:text-4xl">Perfect for every use case</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">Whether you&apos;re prototyping or scaling to millions of users</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* MVP Development */}
            <Card.Root className="group relative overflow-hidden border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <Card.Header className="relative pb-4">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
                  <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Card.Title className="text-lg font-semibold">MVP Development</Card.Title>
              </Card.Header>
              <Card.Content className="relative pt-0">
                <Card.Description className="text-sm leading-relaxed">
                  Build and test billing locally before choosing a payment provider
                </Card.Description>
                <div className="mt-4 inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
                  <span>Start building today</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card.Content>
            </Card.Root>

            {/* Multi-tenant SaaS */}
            <Card.Root className="group relative overflow-hidden border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <Card.Header className="relative pb-4">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/20">
                  <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Card.Title className="text-lg font-semibold">Multi-tenant SaaS</Card.Title>
              </Card.Header>
              <Card.Content className="relative pt-0">
                <Card.Description className="text-sm leading-relaxed">
                  Different providers per tenant or region with the same codebase
                </Card.Description>
                <div className="mt-4 inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400">
                  <span>Scale globally</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card.Content>
            </Card.Root>

            {/* A/B Testing */}
            <Card.Root className="group relative overflow-hidden border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <Card.Header className="relative pb-4">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                  <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Card.Title className="text-lg font-semibold">A/B Testing</Card.Title>
              </Card.Header>
              <Card.Content className="relative pt-0">
                <Card.Description className="text-sm leading-relaxed">Test different payment providers to optimize conversion rates</Card.Description>
                <div className="mt-4 inline-flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  <span>Optimize conversions</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card.Content>
            </Card.Root>

            {/* Migration */}
            <Card.Root className="group relative overflow-hidden border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <Card.Header className="relative pb-4">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Card.Title className="text-lg font-semibold">Migration</Card.Title>
              </Card.Header>
              <Card.Content className="relative pt-0">
                <Card.Description className="text-sm leading-relaxed">
                  Migrate between providers without rewriting your billing logic
                </Card.Description>
                <div className="mt-4 inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                  <span>Seamless migration</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card.Content>
            </Card.Root>
          </div>
        </div>

        <Separator className="my-16" />
      </main>

      {/* Provider Demo */}
      <ProviderDemo />

      {/* Checkout Experience Section */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="text-center">
              <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl">Your payment backend lives in a file</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Configure your payment logic in a single file and test locally with PayKit's development provider
              </p>
            </div>

            <div className="bg-muted/20 relative mt-7 rounded-2xl border p-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20"></div>
              <div className="bg-background relative space-y-6 rounded-xl p-8 md:p-12">
                {/* Browser Chrome */}
                <div className="mx-auto max-w-4xl">
                  <div className="bg-muted rounded-t-lg border p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="bg-background text-muted-foreground flex-1 rounded px-3 py-1 text-xs">
                        http://localhost:3001/checkout?id=eyiou...
                      </div>
                    </div>
                  </div>

                  {/* Checkout Preview */}
                  <div className="bg-background rounded-b-lg border border-t-0 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Form Preview */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-left font-semibold">Secure Checkout</h3>
                          <p className="text-muted-foreground text-left text-sm">Powered by PayKit Local Provider</p>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted/30 rounded-lg border p-3">
                            <div className="mb-2 text-left text-xs font-medium">Customer Information</div>
                            <div className="space-y-2">
                              <div className="bg-background text-muted-foreground h-6 rounded border px-2 py-1 text-xs">john@example.com</div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-background text-muted-foreground h-6 rounded border px-2 py-1 text-xs">John</div>
                                <div className="bg-background text-muted-foreground h-6 rounded border px-2 py-1 text-xs">Doe</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted/30 rounded-lg border p-3">
                            <div className="mb-2 text-left text-xs font-medium">Payment Method</div>
                            <div className="bg-background text-muted-foreground h-6 rounded border px-2 py-1 text-xs">4242 4242 4242 4242</div>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary Preview */}
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg border p-4">
                          <div className="mb-3 text-left text-xs font-medium">Order Summary</div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">PayKit Pro License</span>
                              <span className="font-medium">$99.00</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Local provider fee</span>
                              <span className="font-medium text-green-600">$0.00</span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between text-sm font-bold">
                                <span>Total</span>
                                <span>$99.00</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="bg-primary text-primary-foreground w-full rounded px-3 py-2 text-center text-xs font-medium">
                              Complete Payment - $99.00
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                Ready to build
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  payment-agnostic apps?
                </span>
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">Start with local development today. Deploy to any provider tomorrow.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild variant="outline" size="lg">
                <Link href="/docs">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-bold">PayKit</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The payment toolkit for TypeScript developers. Build locally, deploy anywhere.
              </p>
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/docs">
                    <BookOpen className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/docs/features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/docs/provider" className="hover:text-foreground transition-colors">
                    Providers
                  </Link>
                </li>
                <li>
                  <Link href="/docs/provider/local" className="hover:text-foreground transition-colors">
                    Local Development
                  </Link>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div className="space-y-4">
              <h3 className="font-semibold">Developers</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="docs/examples" className="hover:text-foreground transition-colors">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="mailto:emmanuelodii80@gmail.com" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-muted-foreground text-sm">© 2024 PayKit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
