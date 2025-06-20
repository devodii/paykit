import { PayKitProvider } from './paykit-provider';
import { Checkout } from './resources/checkout';
import { Customer } from './resources/customer';
import { Subscription } from './resources/subscription';
import { WebhookEvent, WebhookHandler } from './resources/webhook';

export interface WebhookConfig {
  provider: PayKitProvider;
  webhookSecret: string;

  /**
   * Customer events
   */
  onCustomerCreated?: WebhookHandler<Customer>;
  onCustomerUpdated?: WebhookHandler<Customer>;
  onCustomerDeleted?: WebhookHandler<Customer>;

  /**
   * Subscription events
   */
  onSubscriptionCreated?: WebhookHandler<Subscription>;
  onSubscriptionUpdated?: WebhookHandler<Subscription>;
  onSubscriptionCanceled?: WebhookHandler<Subscription>;

  /**
   * Checkout events
   */
  onCheckoutCreated?: WebhookHandler<Checkout>;
}

export class Webhook {
  constructor(private config: WebhookConfig) {}

  handleWebhook = async (payload: string, signature: string): Promise<void> => {
    const { provider, webhookSecret, ...handlers } = this.config;

    const event = await provider.handleWebhook({ payload, signature, secret: webhookSecret });
    switch (event.type) {
      case 'customer.created':
        return handlers.onCustomerCreated?.(event as WebhookEvent<Customer>);
      case 'customer.updated':
        return handlers.onCustomerUpdated?.(event as WebhookEvent<Customer>);
      case 'customer.deleted':
        return handlers.onCustomerDeleted?.(event as WebhookEvent<Customer>);
      case 'subscription.created':
        return handlers.onSubscriptionCreated?.(event as WebhookEvent<Subscription>);
      case 'subscription.updated':
        return handlers.onSubscriptionUpdated?.(event as WebhookEvent<Subscription>);
      case 'subscription.canceled':
        return handlers.onSubscriptionCanceled?.(event as WebhookEvent<Subscription>);
    }
  };
}
