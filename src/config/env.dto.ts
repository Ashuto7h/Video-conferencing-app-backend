import { IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

export class EnvVars extends IntersectionType(JwtConfig) {
    @IsNumber()
    PORT: number = 8000;

    @IsString()
    MONGODB_URL: string;
}
