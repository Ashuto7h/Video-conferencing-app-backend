import { Resolver, Args, Int, ResolveField, Parent, Query, Mutation } from '@nestjs/graphql';
import { Author } from './author.model';
import { AuthorsService } from './author.service';
import { PostsService } from '../post/post.service';
import { Post } from '../post/post.model';

@Resolver(() => Author)
export class AuthorsResolver {
    constructor(private authorsService: AuthorsService, private postsService: PostsService) {}

    @Query(() => Author, { name: 'author' })
    author(@Args('id', { type: () => Int }) id: number) {
        return this.authorsService.findOneById(id);
    }

    @ResolveField('posts', () => [Post])
    posts(@Parent() author: Author) {
        const { id } = author;
        return this.postsService.findAll({ authorId: id });
    }

    @Mutation(() => Post, { nullable: true })
    upvotePost(@Args({ name: 'postId', type: () => Int }) postId: number) {
        return this.postsService.upvoteById({ id: postId });
    }
}
