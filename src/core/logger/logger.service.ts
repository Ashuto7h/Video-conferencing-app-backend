import { Injectable, Scope } from '@nestjs/common';
import { createLogger } from 'winston';
import { getALSContext } from '../../common/middlewares/context.middleware';
import { formatError } from './formats/error-format';
import { ErrorProperties } from './interfaces/error-properties.interface';
import { getLoggerOptions } from './formats/logger.format';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
    private _serviceName = '';

    private _methodName = '';

    public get serviceName(): string {
        return this._serviceName;
    }

    public set serviceName(value: string) {
        this._serviceName = value;
    }

    public get methodName(): string {
        return this._methodName;
    }

    public set methodName(value: string) {
        this._methodName = value;
        this.info(`Calling ${this.serviceName}.${this.methodName}`);
    }

    info(msg: string, ...meta: object[]) {
        this.getLogger().info(msg, ...meta);
    }

    log(level: string, message: string) {
        this.getLogger().info(level, message);
    }

    warn(msg: string, ...meta: object[]) {
        this.getLogger().warn(msg, ...meta);
    }

    debug(msg: string, details?: string | object, ...meta: object[]) {
        this.getLogger().debug(
            `${msg} ${details ? JSON.stringify(details, null, 2) : ''}`.trim(),
            ...meta,
        );
    }

    error(error: unknown, msg = '', ...meta: object[]) {
        this.getLogger(error).error(msg || (error as Error).message, ...meta);
    }

    private getLogger(error?: unknown) {
        const { correlationId, ip } = getALSContext();
        const errorProps: ErrorProperties = formatError(error);
        const childLogger = createLogger(getLoggerOptions()).child({
            correlationId,
            ip,
            methodName: this.methodName,
            serviceName: this.serviceName,
            ...errorProps,
        });
        return childLogger;
    }
}
