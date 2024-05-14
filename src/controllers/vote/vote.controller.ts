import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../database/data-source";
import { UserVote } from "../../database/entity/user_votes";
import { UserVoteRequest } from "./types/userVote";
import { ApiError } from "../../helpers/api-error";

export class VoteController {
    private voteRepository = AppDataSource.getRepository(UserVote);

    async create(voteData: UserVoteRequest): Promise<UserVote> {
        const vote = await this.voteRepository.exists({
            where: {
                postId: voteData.postId,
                userId: voteData.userId,
            }
        });

        if(vote){
            this.update(voteData);
        }

        return await this.voteRepository.save(voteData);
    }

    async findOne(voteData: Partial<UserVoteRequest>):Promise<UserVote> {
        const vote = await this.voteRepository.findOne({
            where: {
                postId: voteData.postId,
                userId: voteData.userId,
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

    async update(voteData: UserVoteRequest):Promise<UserVote> {
        const { upvote } = voteData;
        const vote = await this.findOne(voteData);

        if(upvote == null){
            vote.upvote = null;
        }else{
            vote.upvote =  upvote ?? false; 
        }
        
        vote.updatedAt = new Date();
        
        return await this.voteRepository.save(vote);
    }


    async remove(voteData: UserVoteRequest): Promise<{delete: boolean}> {

        const vote = await this.findOne(voteData);

        vote.upvote = null;

        vote.deletedAt = new Date();

        await this.voteRepository.save(vote);

        return {delete: true}
    }
}