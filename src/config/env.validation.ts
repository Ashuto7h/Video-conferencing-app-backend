import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvVars } from './env.dto';

export function envValidate(config: Record<string, unknown>) {
    const envInstance = plainToInstance(EnvVars, config, {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
    });

    const errors = validateSync(envInstance, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return envInstance;
}
