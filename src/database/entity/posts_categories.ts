import { 
    Entity, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from 'typeorm';
import Base from './base';
import { Post } from './posts';
import { Category } from './categories';


@Entity('posts_categories')
export class PostCategory extends Base {
    @Column({ name: 'category_id', type: 'int8' })
    categoryId: number;

    @Column({ name: 'post_id', type: 'int8' })
    postId: number;

    @ManyToOne(
        () => Post, 
        (post) => post.posts_categories
    )
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(
        () => Category, 
        (category) => category.posts_categories
    )
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
