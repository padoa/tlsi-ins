export interface INSiErrorOptions {
  requestId: string;
  originalError: any;
}

export class InsiError extends Error {
  public requestId: string;
  public originalError: string;

  constructor({ originalError, requestId }: INSiErrorOptions) {
    super(originalError.body);
    this.requestId = requestId;
    this.originalError = originalError;
  }
}
