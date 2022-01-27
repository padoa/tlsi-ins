export interface INSiErrorOptions {
    requestId: string;
    originalError: any;
}
export declare class InsiError extends Error {
    requestId: string;
    originalError: string;
    constructor({ originalError, requestId }: INSiErrorOptions);
}
