import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../database/data-source';
import { Post } from '../../database/entity/posts';
import { PostCategory } from '../../database/entity/posts_categories';

import PostInterface from './interface/post.interface';
import { ApiError } from '../../helpers/api-error';

export class PostController {
    private postRepository = AppDataSource.getRepository(Post);
    private postCategoryRepository = AppDataSource.getRepository(PostCategory);

    async create(postData: Partial<PostInterface>): Promise<Post | null> {
        const post = await this.postRepository.save(postData)

        if(postData.categoryId){
            const postCategoryData: Partial<PostCategory> = {
                postId: post?.id,
                categoryId: postData?.categoryId
            }
            await this.postCategoryRepository.save(postCategoryData);
        }
        
        return post;
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: {
                id: id
            },
        })

        if(!post){
            throw new ApiError(
                'Nem um post com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        return post;
    }

    async find(): Promise<Post[]> {
        return await this.postRepository.find();
    }

    async update(id: number, postData: Partial<PostInterface>): Promise<Post | null> {
        const { title, content } = postData;

        const post = await this.findOne(id);

        if(!post){
            throw new ApiError(
                'Nem um post com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        post.title = title ?? post.title;

        post.content = content ?? post.content;

        post.updatedAt = new Date();

        return await this.postRepository.save(post);
    }

    async remove(id: number): Promise<Post> {
        await this.postCategoryRepository.softDelete({ postId: id })
        return await this.postRepository.softRemove({
            id: id
        });
    }

    async listWithVotes(offset: number): Promise<any> {

        const result = await this.postCategoryRepository.query(`
                    select (select count(*) from users_votes where post_id = posts.id) as total_votes, posts.id as post_id, posts.title,
                    posts.content, posts.created_at, posts.updated_at,
                        users.name as autor, categories.name  from posts
                    inner join users on posts.user_id = users.id
                    inner join posts_categories on posts.id = posts_categories.post_id
                    inner join categories on posts_categories.category_id = categories.id       
                        order by posts.created_at desc  limit 10 offset ${offset}
            `);

        return { result: result, totalPage: result.length }

    }

    async listWithVotesByUserID(userId:number, offset: number): Promise<any> {

        const result = await this.postCategoryRepository.query(`
                    select (select count(*) from users_votes where post_id = posts.id) as total_votes, posts.id as post_id, posts.title,
                    posts.content, posts.created_at, posts.updated_at,
                        users.name as autor, categories.name  from posts
                    inner join users on posts.user_id = users.id
                    inner join posts_categories on posts.id = posts_categories.post_id
                    inner join categories on posts_categories.category_id = categories.id       
                    where users.id = ${userId}
                        order by posts.created_at desc  limit 10 offset ${offset}
            `);

        return { result: result, totalPage: result.length }

    }


    async listWithVotesByTotalVotes(offset: number): Promise<any> {

        const result = await this.postCategoryRepository.query(`
                    select (select count(*) from users_votes where post_id = posts.id) as total_votes, posts.id as post_id, posts.title,
                    posts.content, posts.created_at, posts.updated_at,
                        users.name as autor, categories.name  from posts
                    inner join users on posts.user_id = users.id
                    inner join posts_categories on posts.id = posts_categories.post_id
                    inner join categories on posts_categories.category_id = categories.id     
              
                        order by total_votes desc  limit 10 offset ${offset}
            `);

        return { result: result, totalPage: result.length }

    }

 
    async addPostCategory(postCategoryData: Partial<PostInterface>): Promise<PostCategory> {
       
            return await this.postCategoryRepository.save(postCategoryData);
     
    }

    async removePostCategory(categoryId: number): Promise<PostCategory> {     
        return await this.postCategoryRepository.softRemove({
            id: categoryId
        });     
    }
}