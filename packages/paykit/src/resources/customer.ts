import { PaykitMetadata } from '../types';

export interface Customer {
  /**
   * The ID of the customer.
   */
  id: string;
  /**
   * The email of the customer.
   */
  email?: string;
  /**
   * The name of the customer.
   */
  name?: string;
  /**
   * The metadata of the customer.
   */
  metadata?: PaykitMetadata;
}

export interface CreateCustomerParams {
  /**
   * The email of the customer.
   */
  email: string;
  /**
   * The name of the customer.
   */
  name?: string;
  /**
   * The metadata of the customer.
   */
  metadata?: PaykitMetadata;
}

export interface UpdateCustomerParams {
  /**
   * The email of the customer.
   */
  email?: string;
  /**
   * The name of the customer.
   */
  name?: string;
  /**
   * The metadata of the customer.
   */
  metadata?: PaykitMetadata;
}
