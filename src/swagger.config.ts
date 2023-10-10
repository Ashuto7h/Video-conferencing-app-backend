import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiV1Imports } from './routes/v1/api-v1.routes';

// eslint-disable-next-line @typescript-eslint/ban-types
export const configSwaggerForV1 = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('NestJS Template')
        .setVersion('1.0')
        .addServer('http://localhost:3000')
        .addServer('http://develop.example.com')
        .addServer('http://staging.example.com')
        .addServer('http://example.com')
        .addBasicAuth({ type: 'http', scheme: 'basic' })
        .addBearerAuth({ type: 'http', bearerFormat: 'JWT', scheme: 'bearer' })
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        // eslint-disable-next-line @typescript-eslint/ban-types
        include: ApiV1Imports as Function[],
    });
    SwaggerModule.setup('api/v1/docs', app, document);
};
