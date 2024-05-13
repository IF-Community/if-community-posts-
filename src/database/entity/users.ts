import { 
    Entity, 
    Column, 
    OneToMany 
} from "typeorm";
import Base from "./base";
import { Post } from "./posts";
import { UserVote } from "./user_votes";

@Entity("users")
export class User extends Base {
    @Column({ 
        name: "communit_id", 
        nullable: true,  
        comment: "id referente ao microservice de if communit user" 
    })
    communitId: number;

    @Column({ 
        name: "name", 
        type: "varchar", 
        length: 200 
    })
    name: string;

    @OneToMany(
        () => Post, 
        (posts) => posts.user
    )
    posts: Post[];

    @OneToMany(
        () => UserVote, 
        (votes) => votes.user
    )
    votes: UserVote[];
}