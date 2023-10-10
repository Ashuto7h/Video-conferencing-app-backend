import { IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class DatabaseConfig {
    @IsString()
    @IsNotEmpty()
    DATABASE_DIALECT: 'postgres';

    @IsString()
    @IsNotEmpty()
    DATABASE_HOST: string;

    @IsString()
    @IsNotEmpty()
    DATABASE_NAME: string;

    @IsString()
    @IsNotEmpty()
    DATABASE_PASSWORD: string;

    @IsNumber()
    DATABASE_PORT: number;

    @IsString()
    @IsNotEmpty()
    DATABASE_USERNAME: string;

    @IsBoolean()
    @IsOptional()
    DATABASE_LOGGING: boolean = false;
}

class JwtConfig {
    @IsString()
    @IsNotEmpty()
    JWT_ACCESS_SECRET: string;

    @IsString()
    JWT_ACCESS_EXPIRY: string = '1h';

    @IsString()
    @IsNotEmpty()
    JWT_REFRESH_SECRET: string;

    @IsString()
    JWT_REFRESH_EXPIRY: string = '7d';
}

export class EnvVars extends IntersectionType(DatabaseConfig, JwtConfig) {
    @IsNumber()
    PORT: number = 3000;
}
