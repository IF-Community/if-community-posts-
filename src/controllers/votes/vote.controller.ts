import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../database/data-source';
import { UserVote } from '../../database/entity/user_votes';
import { ApiError } from '../../helpers/api-error';


export class VoteController {
    private voteRepository = AppDataSource.getRepository(UserVote);

    async create(voteData: Partial<UserVote>): Promise<UserVote> {

        const vote = await this.voteRepository.findOne({
            where: {
                postId: voteData.postId,
                userId: voteData.userId,
            }
        });

        if(vote){
            throw new ApiError(
                'já exite um vote cadastrado no sistema de user para o post',
                StatusCodes.CONFLICT
            )
        }

        return await this.voteRepository.save(voteData);
    }

    async findOne(id: number): Promise<UserVote> {

        const vote = await this.voteRepository.findOne({
            where: {
                id: id
            }
        });

        if(!vote){
            throw new ApiError(
                'Nem um vote com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        return vote;
    }

    async find(): Promise<UserVote[]> {
        return await this.voteRepository.find();
    }

    async update(id: number, voteData: Partial<UserVote>): Promise<UserVote> {
        const { upvote } = voteData;
        const vote = await this.findOne(id);
        
        if(!vote){
            throw new ApiError(
                'Nem um vote com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        if(upvote == null){
            vote.upvote = null;
        }else{
            vote.upvote =  upvote ?? false; 
        }
        
        
        vote.updatedAt = new Date();
        
        return await this.voteRepository.save(vote);
    }


    async remove(id: number): Promise<UserVote | null> {
        const removeVote = await this.voteRepository.softRemove({
            id: id
        });

        console.log(removeVote);

        return removeVote;
    }
}