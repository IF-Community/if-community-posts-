import { 
    Column, 
    Entity, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import Base from "./base";
import { Post } from "./posts";
import { User } from "./users"

@Entity('users_votes')
export class UserVote extends Base {
    @Column({ 
        name: 'upvote', 
        type: 'boolean', 
        nullable: true 
    })
    upvote: boolean | null;

    @Column({ 
        name: 'user_id', 
        type: 'int8' 
    })
    userId: number;

    @Column({ 
        name: 'post_id', 
        type: 'int8' 
    })
    postId: number;

    @ManyToOne(
        () => User, 
        (user) => user.votes
    )
    @JoinColumn({ 
        name: 'user_id' 
    })
    user: User;

    @ManyToOne(
        () => Post, 
        (post) => post.votes
    )
    @JoinColumn({ 
        name: 'post_id' 
    })
    post: Post;
}