import { 
    Entity, 
    Column, 
    OneToMany, 
    ManyToOne, 
    JoinColumn 
} from 'typeorm';
import { PostCategory } from './posts_categories';
import Base from './base';
import {User} from './users';
import { UserVote } from "./user_votes";

@Entity('posts')
export class Post extends Base {
    @Column({ 
        type: 'varchar', 
        length: 200 
    })
    title: string;

    @Column({ 
        type: 'text' 
    })
    content: string;

    @Column({ 
        name: 'user_id' 
    })
    userId: number;

    @OneToMany(
        () => PostCategory, 
        (posts_categories) => posts_categories.post,
    )
    posts_categories: PostCategory[];

    @ManyToOne(
        () => User, 
        (user) => user.posts
    )
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(
        () => UserVote, 
        (votes) => votes.post
    )
    votes: UserVote[];
}
