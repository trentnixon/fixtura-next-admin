/** Server-action result envelope — avoids throwing expected API errors (which become HTTP 500). */

export type AccountHealthMutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export function accountHealthMutationSuccess<T>(
  data: T
): AccountHealthMutationResult<T> {
  return { ok: true, data };
}

export function accountHealthMutationFailure(
  message: string
): AccountHealthMutationResult<never> {
  return { ok: false, message };
}

export function unwrapAccountHealthMutation<T>(
  result: AccountHealthMutationResult<T>
): T {
  if (!result.ok) {
    throw new Error(result.message);
  }
  return result.data;
}
