'use client';

import { cn } from '@/lib/utils';
import { PaymentProvider } from '@paykit-sdk/core';

interface ProviderListProps {
  selectedProvider: PaymentProvider;
  onProviderSelect: (provider: PaymentProvider) => void;
}

const providers = [
  {
    key: 'stripe' as PaymentProvider,
    name: 'Stripe',
    description: 'Global payment processing',
  },
  {
    key: 'polar' as PaymentProvider,
    name: 'Polar',
    description: 'Creator monetization',
  },
  {
    key: 'gumroad' as PaymentProvider,
    name: 'Gumroad',
    description: 'Digital product sales',
  },
];

export function ProviderList({ selectedProvider, onProviderSelect }: ProviderListProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-muted-foreground mb-4 text-sm font-medium">Payment Providers</h3>
      {providers.map(provider => (
        <button
          key={provider.key}
          onClick={() => onProviderSelect(provider.key)}
          className={cn(
            'w-full cursor-pointer rounded-lg p-3 text-left transition-colors',
            selectedProvider === provider.key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          <div className="font-medium">{provider.name}</div>
          <div className="text-muted-foreground mt-1 text-xs">{provider.description}</div>
        </button>
      ))}
    </div>
  );
}
