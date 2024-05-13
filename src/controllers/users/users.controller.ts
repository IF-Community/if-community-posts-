import AppDataSource from '../../database/data-source';
import { User } from '../../database/entity/users';
import { PostgresError } from "pg-error-enum";
import { ApiError } from '../../helpers/api-error';
import { StatusCodes } from 'http-status-codes';

export class UsersController {
    private userRepository = AppDataSource.getRepository(User);

    async create(userData: Partial<User>): Promise<User | void> {
        try {
            return await this.userRepository.save(userData);
        } catch (error: any) {

            if (error.code === PostgresError.UNIQUE_VIOLATION) {
                throw new ApiError(
                    'Já existe um usuário com este ID de comunidade.',
                    StatusCodes.CONFLICT
                );
            }

        }
    }
    

    async findOne(communitId: number): Promise<User> {

        const user = await this.userRepository.findOne({
            where: {
                communitId: communitId
            },
        });

        if(!user){
            throw new ApiError(
                'Nem um usuário com o communitId informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        return user;
    }

    async find(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        const { name } = userData;
        const user = await this.userRepository.findOne({
            where: { id: id }
        });

        if(!user){
            throw new ApiError(
                'Nem um usuário com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        user.name = name ?? user.name;

        user.updatedAt = new Date();

        return await this.userRepository.save(user);
    }

    async remove(id: number): Promise<User> {

        const userExists = await this.userRepository.exists({
            where: { id }
        });

        if (!userExists) {
            throw new ApiError(
                'Nenhum usuário com o ID informado está cadastrado no sistema.',
                StatusCodes.NOT_FOUND
            );
        }

        return await this.userRepository.softRemove({
            id: id
        });
    }

}