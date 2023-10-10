import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { envValidate } from './config/env.validation';
import { LoggerModule } from './core';
import { APIV1Module } from './api/v1/v1.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            validate: envValidate,
            load: [configuration],
        }),
        LoggerModule,
        APIV1Module,
    ],
})
export class AppModule {}
