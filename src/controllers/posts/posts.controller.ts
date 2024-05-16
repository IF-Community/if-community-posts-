import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../database/data-source';
import { Post } from '../../database/entity/posts';
import { PostCategory } from '../../database/entity/posts_categories';
import { ApiError } from '../../helpers/api-error';
import PostRequest from './types/post';
import UsersController from '../users/users.controller';


export class PostController {
    private postRepository = AppDataSource.getRepository(Post);
    private postCategoryRepository = AppDataSource.getRepository(PostCategory);
    private userController = new UsersController();

    async create(postData: PostRequest): Promise<Post> {
        await this.userController.findOne(postData.userId);   
        return await this.postRepository.save(postData);
    }

    async find(pageNumber: number, pageSize: number) {
            const skip = (pageNumber - 1) * pageSize;
            const take = pageSize;

            const [posts, totalCount] = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                .leftJoinAndSelect('post.posts_categories', 'posts_categories')
                .leftJoinAndSelect('posts_categories.category', 'category')
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

    async update(id: number, postData: Partial<PostRequest> ): Promise<Post> {
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

        post.updatedAt = new Date();

        return await this.postRepository.save(post);
    }

    async remove(id: number): Promise<{delete: boolean}> {

        const postToDelete = await this.postCategoryRepository.softDelete({ postId: id })

        if(!postToDelete){
            throw new ApiError(
                'Categoria não encontrado para exclusão',
                StatusCodes.CONFLICT
            );
        }
        
        await this.postRepository.softRemove({ id });

        return {delete: true};
    }
    
}