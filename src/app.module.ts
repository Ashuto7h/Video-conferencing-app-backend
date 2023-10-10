import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { envValidate } from './config/env.validation';
import { DatabaseModule, LoggerModule } from './core';
import { ModelsModule } from './models';
import { RepositoryModule } from './repository';
import { APIV1Module } from './routes/v1';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            validate: envValidate,
            load: [configuration],
        }),
        DatabaseModule,
        LoggerModule,
        RepositoryModule,
        ModelsModule,
        APIV1Module,
    ],
})
export class AppModule {}
