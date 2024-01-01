import { Module } from '@nestjs/common';
import { AuthorsResolver } from './author.resolver';
import { AuthorsService } from './author.service';
import { PostModule } from '../post/post.module';

@Module({
    imports: [PostModule],
    providers: [AuthorsResolver, AuthorsService],
    exports: [AuthorsResolver],
})
export class AuthorModule {}
