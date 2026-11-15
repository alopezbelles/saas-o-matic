export class InputError extends Error {
  constructor(
    public readonly code: string,
    public readonly fields: Record<string, string> = {},
  ) {
    super(code);
  }
}
