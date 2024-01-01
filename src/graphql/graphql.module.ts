import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthorModule } from './author/author.module';
import { PostModule } from './post/post.module';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
            sortSchema: true,
            playground: true,
        }),
        AuthorModule,
        PostModule,
    ],
})
export class GraphqlModule {}
