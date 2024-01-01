import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APIV1Module } from './api/v1/v1.module';
import { configuration } from './config/configuration';
import { envValidate } from './config/env.validation';
import { LoggerModule } from './core';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            validate: envValidate,
            load: [configuration],
        }),
        GraphqlModule,
        LoggerModule,
        APIV1Module,
    ],
})
export class AppModule {}
