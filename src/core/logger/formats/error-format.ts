import { HttpException } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { ErrorProperties } from '../interfaces/error-properties.interface';

export function formatError(error: unknown, isDetailed = false): ErrorProperties {
    if (isAxiosError(error)) {
        const errorDetails: ErrorProperties = {
            errorResponse: error.response?.data as unknown,
            message: error.message,
            statusCode: error.response?.status,
            statusText: error.response?.statusText,
        };

        if (isDetailed) {
            errorDetails.requestConfig = error.response?.config;
            errorDetails.stack = error.stack;
        }

        return errorDetails;
    }

    if (error instanceof HttpException) {
        return {
            errorResponse: error.getResponse(),
            stack: error.stack,
        };
    }

    if (error instanceof Error) {
        return {
            errorResponse: error.message,
            stack: error.stack,
        };
    }

    return {
        message: JSON.stringify(error),
    };
}
