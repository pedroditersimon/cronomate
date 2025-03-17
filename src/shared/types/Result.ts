/**
 * Standardized object for operation responses
 * @template T - Data type for successful operations (optional)
 */
export type Result<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

/** Helper for successful results without data */
export function ok(): Result<void>;
/** Helper for successful results with data */
export function ok<T>(data: T): Result<T>;

export function ok<T>(data?: T): Result<T> {
    return { success: true, data: data as T };
}

/** Helper for failed results */
export function err(errMessage: string): Result<never> {
    return { success: false, error: errMessage };
}
