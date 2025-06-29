import {
  PayKitProvider,
  Checkout,
  CreateCheckoutParams,
  CreateCustomerParams,
  Customer,
  UpdateCustomerParams,
  Subscription,
  UpdateSubscriptionParams,
  ERR,
  OK,
  unwrapAsync,
  WebhookProviderPayload,
  WebhookEventPayload,
  AbortedError,
  ConnectionError,
  TimeoutError,
  UnauthorizedError,
  UnknownError,
  ValidationError,
  isAbortError,
  isConnectionError,
  isTimeoutError,
  isUnauthorizedError,
  PaykitProviderOptions,
} from '@paykit-sdk/core';

export interface GumroadConfig extends PaykitProviderOptions<{ accessToken: string }> {}

export class GumroadProvider implements PayKitProvider {
  constructor(private config: GumroadConfig) {}

  private readonly baseUrl = 'https://api.gumroad.com/v2';

  createCheckout = async (params: CreateCheckoutParams): Promise<Checkout> => {
    const response = await unwrapAsync(
      fetch(`${this.baseUrl}/checkouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.accessToken}` },
      })
        .then(res => OK<{ url: string }>(res))
        .catch(err => {
          switch (true) {
            case isUnauthorizedError(err):
              return ERR(new UnauthorizedError('Unauthorized', { provider: 'gumroad' }));
            case isConnectionError(err):
              return ERR(new ConnectionError('Connection error', { provider: 'gumroad' }));
            case isTimeoutError(err):
              return ERR(new TimeoutError('Timeout error', { cause: err, provider: 'gumroad' }));
            case isAbortError(err):
              return ERR(new AbortedError('Aborted error', { provider: 'gumroad' }));
            default:
              return ERR(new UnknownError('Unknown error', { cause: err, provider: 'gumroad' }));
          }
        }),
    );

    throw new ValidationError(response.url, { provider: 'gumroad', cause: 'fix everything' });
  };

  retrieveCheckout = async (id: string): Promise<Checkout> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  createCustomer = async (params: CreateCustomerParams): Promise<Customer> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  updateCustomer = async (id: string, params: UpdateCustomerParams): Promise<Customer> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  retrieveCustomer = async (id: string): Promise<Customer> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  updateSubscription = async (id: string, params: UpdateSubscriptionParams): Promise<Subscription> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  cancelSubscription = async (id: string): Promise<Subscription> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  retrieveSubscription = async (id: string): Promise<Subscription> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };

  handleWebhook = async (payload: WebhookProviderPayload): Promise<WebhookEventPayload> => {
    throw new UnknownError('Not implemented', { provider: 'gumroad' });
  };
}
