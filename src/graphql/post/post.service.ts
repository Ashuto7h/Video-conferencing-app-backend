import { Injectable } from '@nestjs/common';
import { Post } from './post.model';

@Injectable()
export class PostsService {
    private posts: Post[];

    constructor() {
        this.posts = [{ authorId: 1, id: 1, title: 'ABCD', votes: 0 }];
    }

    upvoteById(query: { id: number }): Post | undefined {
        const idx = this.posts.findIndex((post) => post.id === query.id);
        if (idx >= 0) {
            const { votes } = this.posts[idx];
            if (votes) {
                this.posts[idx].votes = votes + 1;
            } else {
                this.posts[idx].votes = 1;
            }
            return this.posts[idx];
        }
        return undefined;
    }

    findAll(query: { authorId: number }): Post[] {
        return this.posts.filter((post) => post.authorId === query.authorId);
    }
}
