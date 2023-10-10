export interface Info extends ErrorProperties {
    context?: string;
    level: string;
    message: string;
    timestamp?: string;
    stack?: string;
    serviceName?: string;
    methodName?: string;
    correlationId?: string;
    ip?: string;
}

export interface ErrorProperties {
    errorResponse?: unknown;
    requestConfig?: unknown;
    stack?: string;
    message?: string;
    statusCode?: number;
    statusText?: string;
}
