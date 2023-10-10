import { EnvVars } from './env.dto';

export const configuration = () => {
    const env = process.env as unknown as EnvVars;
    return {
        PORT: env.PORT,
        DATABASE: {
            DIALECT: 'postgres' as const,
            HOST: env.DATABASE_HOST,
            NAME: env.DATABASE_NAME,
            PASSWORD: env.DATABASE_PASSWORD,
            PORT: env.DATABASE_PORT,
            USERNAME: env.DATABASE_USERNAME,
        },
        JWT: {
            ACCESS_SECRET: env.JWT_ACCESS_SECRET,
            ACCESS_EXPIRY: env.JWT_ACCESS_EXPIRY,
            REFRESH_SECRET: env.JWT_REFRESH_SECRET,
            REFRESH_EXPIRY: env.JWT_REFRESH_EXPIRY,
        },
    };
};

export type Configuration = ReturnType<typeof configuration>;
export type JwtConfig = Configuration['JWT'];
export type DatabaseConfig = Configuration['DATABASE'];
