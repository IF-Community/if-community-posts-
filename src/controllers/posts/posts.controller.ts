import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../database/data-source';
import { Post } from '../../database/entity/posts';
import { PostCategory } from '../../database/entity/posts_categories';
import { ApiError } from '../../helpers/api-error';
import PostRequest from './types/post';
import UsersController from '../users/users.controller';
import { Category } from '../../database/entity/categories';
import { User } from '../../database/entity/users';
import { CategorieController } from '../categories/categories.controllers';


export class PostController {
    private postRepository = AppDataSource.getRepository(Post);
    private postCategoryRepository = AppDataSource.getRepository(PostCategory);
    private userController = new UsersController();
    private categoryController = new CategorieController();

    async create(postData: PostRequest): Promise<Post> {
        await this.userController.findOne(postData.userId);

        const newPost = await this.postRepository.save(postData);

        if(postData.categories){
            this.categoryController.createPostCategory(
                newPost.id,
                postData.categories
            );
        }

        return newPost;
    }

    async find(pageNumber: number, pageSize: number, ordering: boolean) {
        const order = ordering ? 'post.totalUpvotes' : 'post.createdAt';
        const orderAction = ordering ?  'ASC' : 'DESC';
        
        const skip = (pageNumber - 1) * pageSize;
        const take = pageSize;


        const [posts, totalCount] = await this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.posts_categories', 'posts_categories')
            .leftJoinAndSelect('posts_categories.category', 'category')
            .orderBy(order, orderAction)
            .skip(skip)
            .take(take)
            .getManyAndCount();
    
        const mappedPosts = posts.map(post => ({
            id: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deletedAt: post.deletedAt,
            title: post.title,
            content: post.content,
            totalUpvotes: post.totalUpvotes === null ? 0 : post.totalUpvotes,
            posts_categories: post.posts_categories.map(pc => ({
                category: {
                    id: pc.category.id,
                    name: pc.category.name
                }
            })),
            user: {
                id: post.user.id,
                createdAt: post.user.createdAt,
                updatedAt: post.user.updatedAt,
                name: post.user.name
            }
        }));

        const totalPages = Math.ceil(totalCount / pageSize);
        return { totalPages, results: mappedPosts }
    }

    async findByUser(id: number,pageNumber: number, pageSize: number) {
        const skip = (pageNumber - 1) * pageSize;
        const take = pageSize;

        const [posts, totalCount] = await this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.posts_categories', 'posts_categories')
            .leftJoinAndSelect('posts_categories.category', 'category')
            .where('post.user_id = :id', { id })
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(take)
            .getManyAndCount();
    
        const mappedPosts = posts.map(post => ({
            id: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deletedAt: post.deletedAt,
            title: post.title,
            content: post.content,
            totalUpvotes: post.totalUpvotes === null ? 0 : post.totalUpvotes,
            userId: post.userId,
            posts_categories: post.posts_categories.map(pc => ({
                category: {
                    id: pc.category.id,
                    name: pc.category.name
                }
            })),
        }));

        const user = await this.userController.findOne(id); 

        const totalPages = Math.ceil(totalCount / pageSize);
        return { user: user ,totalPages, posts: mappedPosts }
    }

    async findByCategories(categoryNames: string[], pageNumber: number, pageSize: number) {
        const skip = (pageNumber - 1) * pageSize;
        const take = pageSize;
    
        const query = AppDataSource
            .createQueryBuilder()
            .select([
                'p.id AS post_id',
                'p.title AS post_title',
                'p.content AS post_content',
                'COALESCE(p.total_upvotes, 0) AS post_upvotes',
                'p.created_at As created_at',
                'p.updated_at As updated_at',
                'json_build_object(\'id\', u.id, \'name\', u.name) AS user',
                'json_agg(json_build_object(\'id\', c.id, \'name\', c.name)) AS categories'
            ])
            .from(Post, 'p')
            .innerJoin(User, 'u', 'p.user_id = u.id')
            .innerJoin(PostCategory, 'pc', 'pc.post_id = p.id')
            .innerJoin(Category, 'c', 'pc.category_id = c.id')
            .where('p.deleted_at IS NULL')
            .andWhere('u.deleted_at IS NULL')
            .andWhere('c.deleted_at IS NULL')
            .andWhere('pc.deleted_at IS NULL')
            .andWhere(subQuery => {
                const subQueryAlias = subQuery
                    .subQuery()
                    .select('p.id')
                    .from(Post, 'p')
                    .innerJoin(PostCategory, 'pc', 'pc.post_id = p.id')
                    .innerJoin(Category, 'c', 'pc.category_id = c.id')
                    .where('c.name IN (:...categoryNames)', { categoryNames: [...categoryNames] })
                    .getQuery();
                return `p.id IN (${subQueryAlias})`;
            })
            .orderBy('p.created_at', 'DESC')
            .groupBy('p.id, p.title, p.content, p.total_upvotes, u.id, u.name');
    
        const totalCountQuery = query.clone().select('COUNT(DISTINCT p.id)', 'total');
        const [results, totalCount] = await Promise.all([
            query.skip(skip).take(take).getRawMany(),
            totalCountQuery.getRawOne()
        ]);
    
        const totalPages = Math.ceil(totalCount.total / pageSize);
    
        return {totalPages ,results };
    }
    
    async findOne(id: number) {
        const post = await this.postRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.posts_categories', 'posts_categories')
        .leftJoinAndSelect('posts_categories.category', 'category')
        .where('post.id = :id', { id })
        .getOne();

        if(!post) {
            throw new ApiError(
                'O post com o id informado não foi encontrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }


        const mappedPost = {
            id: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deletedAt: post.deletedAt,
            title: post.title,
            content: post.content,
            totalUpvotes: post.totalUpvotes === null ? 0 : post.totalUpvotes,
            userId: post.userId,
            posts_categories: post.posts_categories.map(pc => ({
                category: {
                    id: pc.category.id,
                    name: pc.category.name
                }
            })),
            user: {
                id: post.user.id,
                createdAt: post.user.createdAt,
                updatedAt: post.user.updatedAt,
                name: post.user.name
            }
        };

        return mappedPost;
    }

    async update(id: number, postData: Partial<PostRequest> ) {
        const { title, content } = postData;

        const post = await this.postRepository.findOne({
            where: { id }
        });

        if (!post) {
            throw new ApiError(
                'o post não está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        post.title = title ?? post.title;

        post.content = content ?? post.content;

        if(postData.categories){
            this.categoryController.createPostCategory(
                post.id,
                postData.categories
            );
        }

        post.updatedAt = new Date();

        const updatePost = await this.postRepository.save(post);

        return this.findOne(updatePost.id)
    }

    async remove(id: number): Promise<{ delete: boolean }> {

        const postToDelete = await this.postCategoryRepository.softDelete({ postId: id })

        if(!postToDelete){
            throw new ApiError(
                'Post não encontrado para exclusão',
                StatusCodes.NOT_FOUND
            );
        }
        
        await this.postRepository.softRemove({ id });

        return {delete: true};
    }
}