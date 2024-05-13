import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../database/data-source";
import { User } from "../../database/entity/users";
import { ApiError } from "../../helpers/api-error";
import { RequestUser } from "./types";
import { PostgresError } from "pg-error-enum";

class UsersController {
    private userRepository = AppDataSource.getRepository(User);

    async create(userData: RequestUser): Promise<User | void> {
        try {
            return await this.userRepository.save(userData);
        }catch (error: any) {
            if(error.code == PostgresError.UNIQUE_VIOLATION){
                throw new ApiError(
                    'Um usuário com esse communitId já está cadastrado no sistema',
                    StatusCodes.CONFLICT
                );
            }
        }
           
    }

    async findOne(communitId: number): Promise<User> {

        const user = await this.userRepository.findOne({
            where: {
                communitId
            },
        });

        if(!user) {
            throw new ApiError(
                'Um usuário com esse userId não está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        return user;
    }

    async find(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async update(communitId: number, userData: Omit<RequestUser, 'communitId'>): Promise<User> {
        const { name } = userData;
        const user = await this.userRepository.findOne({
            where: { communitId }
        });

        if(!user) {
            throw new ApiError(
                'Um usuário com esse comunitId não está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        user.name = name ?? user.name;

        user.updatedAt = new Date();

        return await this.userRepository.save(user);
    }

    async remove(communitId: number): Promise<{delete: boolean}> {
        const userToDelete = await this.userRepository.softDelete({communitId: communitId});

        if (!userToDelete) {
            throw new ApiError(
                'Usuário não encontrado para exclusão',
                StatusCodes.CONFLICT
            );
        }

        return {delete: true}
    }
}

export default UsersController;