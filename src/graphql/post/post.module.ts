import { Module } from '@nestjs/common';
import { PostsService } from './post.service';

@Module({
    providers: [PostsService],
    exports: [PostsService],
})
export class PostModule {}
