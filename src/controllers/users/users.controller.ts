import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../database/data-source";
import { User } from "../../database/entity/users";
import { ApiError } from "../../helpers/api-error";
import { RequestUser } from "./types/user.types";

class UsersController {
    private userRepository = AppDataSource.getRepository(User);

    async create(userData: RequestUser): Promise<User | void> {
            const userExists = await this.userRepository.exists({
                select: {
                    id: true
                },
                where: { id: userData.id }
            });

            if (userExists) {
                throw new ApiError(
                    'Um usuário com esse id já está cadastrado no sistema',
                    StatusCodes.CONFLICT
                );
            }

            return await this.userRepository.save(userData);
    }

    async findOne(id: number): Promise<User> {

        const user = await this.userRepository.findOne({ where: { id } });

        if(!user) {
            throw new ApiError(
                'Um usuário com esse id não está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        return user;
    }

    async find(pageNumber: number, pageSize: number): Promise<{ totalPages: number, results: User[] }> {
        const [users, totalCount] = await this.userRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        return { totalPages, results: users };
    }

    async update(id: number, userData: Omit<RequestUser, 'id'>): Promise<User> {
        const { name } = userData;
        const user = await this.findOne(id);

        user.name = name ?? user.name;

        user.updatedAt = new Date();

        return await this.userRepository.save(user);
    }

    async remove(id: number): Promise<{delete: boolean}> {
        const userToDelete = await this.userRepository.softDelete({id});

        if (!userToDelete) {
            throw new ApiError(
                'Usuário não encontrado para exclusão',
                StatusCodes.NOT_FOUND
            );
        }

        return {delete: true}
    }
}

export default UsersController;