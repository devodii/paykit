import { ValidationError } from './error';

export type Result<T, E = unknown> = { ok: true; value: T; error?: never } | { ok: false; value?: never; error: E };

export const OK = <V>(value: V): Result<V, never> => ({ ok: true, value });

export const ERR = <E>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * unwrapAsync is a convenience function for resolving a value from a Promise
 * of a result or rejecting if an error occurred.
 */
export const unwrapAsync = async <T>(pr: Promise<Result<T, unknown>>): Promise<T> => {
  const r = await pr;

  if (!r.ok) throw r.error;

  return r.value;
};

export function safeParse<Inp, Out>(rawValue: Inp, fn: (value: Inp) => Out, errorMessage: string): Result<Out, ValidationError> {
  try {
    return OK(fn(rawValue));
  } catch (err) {
    return ERR(new ValidationError(errorMessage, { cause: err, provider: 'paykit' }));
  }
}
