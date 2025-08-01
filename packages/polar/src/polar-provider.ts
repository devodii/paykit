import {
  toPaykitEvent,
  WebhookEventPayload,
  CreateCustomerParams,
  Customer,
  UpdateCustomerParams,
  Checkout,
  CreateCheckoutParams,
  Subscription,
  UpdateSubscriptionParams,
  $ExtWebhookHandlerConfig,
  headersExtractor,
  PayKitProvider,
  PaykitProviderOptions,
  Invoice,
} from '@paykit-sdk/core';
import { Polar, SDKOptions, ServerList } from '@polar-sh/sdk';
import { validateEvent } from '@polar-sh/sdk/webhooks';
import { toPaykitCheckout, toPaykitCustomer, toPaykitInvoice, toPaykitSubscription } from '../lib/mapper';

export interface PolarConfig extends PaykitProviderOptions<SDKOptions> {}

export class PolarProvider implements PayKitProvider {
  private polar: Polar;

  private readonly productionURL = ServerList['production'];
  private readonly sandboxURL = ServerList['sandbox'];

  constructor(private config: PolarConfig) {
    const { accessToken, server, ...rest } = config;
    this.polar = new Polar({ accessToken, serverURL: server === 'sandbox' ? this.sandboxURL : this.productionURL, ...rest });
  }

  /**
   * Checkout management
   */
  createCheckout = async (params: CreateCheckoutParams): Promise<Checkout> => {
    const { metadata, item_id, provider_metadata } = params;

    const response = await this.polar.checkouts.create({ metadata, products: [item_id], ...provider_metadata });

    return toPaykitCheckout(response);
  };

  retrieveCheckout = async (id: string): Promise<Checkout> => {
    const response = await this.polar.checkouts.get({ id });

    return toPaykitCheckout(response);
  };

  /**
   * Customer management
   */
  createCustomer = async (params: CreateCustomerParams): Promise<Customer> => {
    const { email, name, metadata } = params;

    const response = await this.polar.customers.create({ email, name, ...(metadata && { metadata }) });

    return toPaykitCustomer(response);
  };

  updateCustomer = async (id: string, params: UpdateCustomerParams): Promise<Customer> => {
    const { email, name, metadata } = params;

    const response = await this.polar.customers.update({
      id,
      customerUpdate: { ...(email && { email }), ...(name && { name }), ...(metadata && { metadata }) },
    });

    return toPaykitCustomer(response);
  };

  retrieveCustomer = async (id: string): Promise<Customer> => {
    const response = await this.polar.customers.get({ id });

    return toPaykitCustomer(response);
  };

  /**
   * Subscription management
   */
  cancelSubscription = async (id: string): Promise<null> => {
    await this.polar.subscriptions.revoke({ id });

    return null;
  };

  retrieveSubscription = async (id: string): Promise<Subscription> => {
    const response = await this.polar.subscriptions.get({ id });

    return toPaykitSubscription(response);
  };

  updateSubscription = async (id: string, params: UpdateSubscriptionParams): Promise<Subscription> => {
    /**
     * Polar handles validation of the subscriptionUpdate object
     * For supported operations, see: https://docs.polar.sh/
     */
    const response = await this.polar.subscriptions.update({ id, subscriptionUpdate: { ...params.metadata } });

    return toPaykitSubscription(response);
  };

  /**
   * Webhook management
   */
  handleWebhook = async (params: $ExtWebhookHandlerConfig): Promise<WebhookEventPayload> => {
    const { body, headers, webhookSecret } = params;

    const webhookHeaders = headersExtractor(headers, ['webhook-id', 'webhook-timestamp', 'webhook-signature']).reduce(
      (acc, kv) => {
        acc[kv.key] = Array.isArray(kv.value) ? kv.value.join(',') : kv.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    console.log({ headers, webhookHeaders, webhookSecret, body });

    const { data, type } = validateEvent(body, webhookHeaders, webhookSecret);

    const id = webhookHeaders['webhook-id'];
    const timestamp = webhookHeaders['webhook-timestamp'];

    if (type === 'subscription.updated') {
      return toPaykitEvent<Subscription>({ type: '$subscriptionUpdated', created: parseInt(timestamp), id, data: toPaykitSubscription(data) });
    } else if (type === 'subscription.created') {
      return toPaykitEvent<Subscription>({ type: '$subscriptionCreated', created: parseInt(timestamp), id, data: toPaykitSubscription(data) });
    } else if (type === 'subscription.revoked') {
      return toPaykitEvent<Subscription>({ type: '$subscriptionCancelled', created: parseInt(timestamp), id, data: toPaykitSubscription(data) });
    } else if (type === 'customer.created') {
      return toPaykitEvent<Customer>({ type: '$customerCreated', created: parseInt(timestamp), id, data: toPaykitCustomer(data) });
    } else if (type === 'customer.updated') {
      return toPaykitEvent<Customer>({ type: '$customerUpdated', created: parseInt(timestamp), id, data: toPaykitCustomer(data) });
    } else if (type === 'customer.deleted') {
      return toPaykitEvent<Customer | null>({ type: '$customerDeleted', created: parseInt(timestamp), id, data: null });
    } else if (type === 'checkout.created') {
      return toPaykitEvent<Checkout>({ type: '$checkoutCreated', created: parseInt(timestamp), id, data: toPaykitCheckout(data) });
    } else if (type === 'order.created') {
      return toPaykitEvent<Invoice>({ type: '$invoicePaid', created: parseInt(timestamp), id, data: toPaykitInvoice(data) });
    }

    throw new Error(`Unhandled event type: ${type}`);
  };
}
