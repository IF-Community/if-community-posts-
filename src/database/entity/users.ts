import { 
    Entity, 
    Column, 
    OneToMany, 
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";
import { Post } from "./posts";
import { UserVote } from "./user_votes";

@Entity("users")
export class User {
    @PrimaryColumn({ name: 'id', type: 'int8' })
    id: number;

    @Column({ name: "name", type: "varchar", length: 200 })
    name: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: null })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
    deletedAt: Date;

    @OneToMany( () => Post, (posts) => posts.user)
    posts: Post[];

    @OneToMany( () => UserVote, (votes) => votes.user)
    votes: UserVote[];
}
