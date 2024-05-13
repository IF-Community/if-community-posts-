import { 
    Entity, 
    Column, 
    OneToMany 
} from 'typeorm';
import Base from './base';
import { PostCategory } from './posts_categories';


@Entity('categories')
export class Category extends Base {

    @Column({
        name:'name',
        type: 'varchar',
        length: 200,
    })
    name: string;

    @OneToMany(
        () => PostCategory,
        (posts_categories) => posts_categories.category
    )
    posts_categories: PostCategory[];
}