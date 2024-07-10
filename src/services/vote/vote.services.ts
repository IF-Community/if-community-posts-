import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../database/data-source";
import { UserVote } from "../../database/entity/user_votes";
import { UserVoteRequest } from "./types/userVote";
import { ApiError } from "../../helpers/api-error";
import { Post } from "../../database/entity/posts";

export class VoteServices {
    private voteRepository = AppDataSource.getRepository(UserVote);
    private postRepository = AppDataSource.getRepository(Post);

    async total_voutes(id: number, action: string) {

        const post = await this.postRepository.findOne({
            select: { id: true, totalUpvotes: true },
            where: { id }
        });

        if (!post) {
            throw new ApiError(
                'o post não está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }
        
        if(post.totalUpvotes == null) 
            post.totalUpvotes = 0;

        switch (action) {
            case 'add':
                post.totalUpvotes += 1
                break;
            case "remove":
                if(post.totalUpvotes > 0) 
                    post.totalUpvotes -= 1
                break;
            default:
                console.log("🚀 ~ VoteController ~ total_voutes ~ action:", action)
                console.log('A action precisa ser "add" ou "remove"!')

        }

        await this.postRepository.save(post);
    }

    async create_update(voteData: UserVoteRequest): Promise<UserVote | null> {
        const vote = await this.voteRepository.findOne({
            where: {
                postId: voteData.postId,
                userId: voteData.userId,
            }
        });

        if(vote){
            const { upvote } = voteData;

            vote.upvote =  upvote ?? false;

            vote.updatedAt = new Date();

            return await this.voteRepository.save(vote);
        }

        await this.total_voutes(voteData.postId, 'add');
        return await this.voteRepository.save(voteData);
    }

    async findOne(voteData: Partial<UserVoteRequest>):Promise<UserVote> {
        const vote = await this.voteRepository.findOne({
            where: {
                userId: voteData.userId,
                postId: voteData.postId,
            }
        });

        if(!vote){
            throw new ApiError(
                'voto não encontrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        return vote;
    }


    async remove(voteData: UserVoteRequest | { userId: number, postId: number,}): Promise<{delete: boolean}> {

        const vote = await this.findOne(voteData);

        vote.upvote = null;

        vote.deletedAt = new Date();

        await this.voteRepository.save(vote);

        await this.total_voutes(voteData.postId, 'remove')

        return {delete: true}
    }
}