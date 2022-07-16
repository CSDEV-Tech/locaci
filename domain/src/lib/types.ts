export type FieldErrors<T extends Record<string, unknown>> =
    | {
          [k in keyof T]?: string[];
      } & {
          global?: string[];
      };

export type ValidateResult<TRequest extends Record<string, unknown>> =
    | {
          errors: FieldErrors<TRequest>;
          parsedRequest?: undefined;
      }
    | {
          errors?: undefined;
          parsedRequest: TRequest;
      };

// this type serve for setting up some properties of an existing type optional
export type PartialOmit<T, K extends keyof T> = Omit<T, K> & Partial<T>;
/**
 * FieldErrors<{ a, b, c}> = { a?: string[], b?: string[], c?: string[] }
 */

type F2 = FieldErrors<{ a: number; b: string }>;
