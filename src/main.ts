import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './core';
import { configSwaggerForV1 } from './swagger.config';
import { withContext, withCorrelationId } from './common/middlewares';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug'],
        cors: true,
    });
    const logger = await app.resolve(LoggerService);
    app.useLogger(logger);
    app.use(withContext, withCorrelationId);
    app.enableShutdownHooks();
    app.use(helmet());
    const configService = app.get(ConfigService);
    const port = configService.get('PORT') as number;
    const validationPipe = new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
            exposeDefaultValues: true,
        },
    });
    app.useGlobalPipes(validationPipe);
    configSwaggerForV1(app);

    await app.listen(port, () => {
        logger.info(`Listening on port: ${port}`);
    });
}

bootstrap()
    .then(() => {})
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
    });
