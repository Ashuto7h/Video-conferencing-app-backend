import { Injectable } from '@nestjs/common';
import { Author } from './author.model';

@Injectable()
export class AuthorsService {
    findOneById(id: number): Author {
        return { id, posts: [], firstName: 'Barry', lastName: 'Allen' };
    }
}
