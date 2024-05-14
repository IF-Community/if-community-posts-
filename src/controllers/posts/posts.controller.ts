import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../database/data-source';
import { Post } from '../../database/entity/posts';
import { PostCategory } from '../../database/entity/posts_categories';
import { ApiError } from '../../helpers/api-error';
import PostRequest from './types/post';


export class PostController {
    private postRepository = AppDataSource.getRepository(Post);
    private postCategoryRepository = AppDataSource.getRepository(PostCategory);

    async create(postData: PostRequest): Promise<Post> {
        const user = this.postRepository.exists({
            where: { userId: postData.userId }
        })

        if(!user){
            throw new ApiError(
                'o usuario não está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        return await this.postRepository.save(postData);
    }

    async find(pageNumber: number, pageSize: number, ordering: boolean): Promise<{ totalPages: number, result: Post[]}> {
        const order = ordering ? 'total_votes' : 'p.created_at';

        const offset = (pageNumber - 1) * pageSize;

        const result = await this.postCategoryRepository.query(`
            SELECT 
                p.id AS postId,
                p.title AS title,
                p.content AS content,
                p.created_at AS createdAt,
                p.updated_at AS updatedAt,
                json_build_object('id', u.communit_id, 'name', u.name) AS user,
                (SELECT 
                    CASE 
                        WHEN COUNT(pc.category_id) > 0 
                            THEN json_agg(json_build_object('id', c.id, 'name', c.name))
                        ELSE 
                            NULL 
                    END
                FROM 
                    categories c
                LEFT JOIN 
                    posts_categories pc ON p.id = pc.post_id
                WHERE 
                    c.id = pc.category_id
                ) AS categories,
                COALESCE(SUM(CASE WHEN uv.upvote = true THEN 1 ELSE 0 END), 0) AS total_votes
            FROM 
                posts p
            INNER JOIN 
                users u ON p.user_id = u.id
            LEFT JOIN 
                posts_categories pc ON p.id = pc.post_id
            LEFT JOIN 
                users_votes uv ON p.id = uv.post_id
            GROUP BY
                p.id,
                u.communit_id,
                u.name
            ORDER BY
                ${order} DESC
            OFFSET 
                ${ offset }
            LIMIT 
                ${ pageSize };
            `);

        const totalPosts = await this.postRepository.count();
        const totalPages = Math.ceil(totalPosts / pageSize);

        return { totalPages, result};
    }

    async findOne(id: number): Promise<Post> {
        const result = await this.postCategoryRepository.query(`
            SELECT 
                p.id AS postId,
                p.title AS title,
                p.content AS content,
                p.created_at AS createdAt,
                p.updated_at AS updatedAt,
                json_build_object('id', u.communit_id, 'name', u.name) AS user,
                (SELECT 
                    CASE 
                        WHEN COUNT(pc.category_id) > 0 
                            THEN json_agg(json_build_object('id', c.id, 'name', c.name))
                        ELSE 
                            NULL 
                    END
                FROM 
                    categories c
                LEFT JOIN 
                    posts_categories pc ON p.id = pc.post_id
                WHERE 
                    c.id = pc.category_id
                ) AS categories,
                COALESCE(SUM(CASE WHEN uv.upvote = true THEN 1 ELSE 0 END), 0) AS total_votes
            FROM 
                posts p
            INNER JOIN 
                users u ON p.user_id = u.id
            LEFT JOIN 
                posts_categories pc ON p.id = pc.post_id
            LEFT JOIN 
                users_votes uv ON p.id = uv.post_id
            WHERE 
                p.id = ${ id }
            GROUP BY
                p.id,
                u.communit_id,
                u.name;
            `);
        return result[0];
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

    async remove(id: number): Promise<Post> {
        await this.postCategoryRepository.softDelete({ postId: id })
        return await this.postRepository.softRemove({
            id: id
        });
    }
}