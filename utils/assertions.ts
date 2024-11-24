type AssertError = string;

function handleError(
  defaultMessage: string,
  errorMessage?: AssertError
): never {
  throw new Error(errorMessage ?? defaultMessage);
}

export function assertIsDefined<T>(
  value: T,
  error?: AssertError
): asserts value is NonNullable<T> {
  if (value == null) {
    handleError("The value must be defined and not null", error);
  }
}

/**
 * The value parameter passed must be true
 */
export function assertTrue(
  value: boolean,
  error?: AssertError
): asserts value is true {
  if (value === false) {
    handleError("Value must be true", error);
  }
}

/**
 * Use this in case blocks where a default: should never be accessed
 */
export function assertNever<T>(value: never, error?: AssertError): never {
  handleError(`"${value}" should never happen in this context`, error);
}
