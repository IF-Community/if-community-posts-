import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../database/data-source';
import { Category } from '../../database/entity/categories';
import { ApiError } from '../../helpers/api-error';


export class CategorieController {
    private categoryRepository = AppDataSource.getRepository(Category);

    async create(categoryData: Partial<Category>): Promise<Category> {
        return await this.categoryRepository.save(categoryData);
    }

    async findOne(id: number): Promise<Category> {

        const category = await this.categoryRepository.findOne({
            where: {
                id: id
            }
        });

        if(!category) {
            throw new ApiError(
                'Nem uma categoria com o communitId informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        return category;
    }

    async find(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async update(id: number, categoryData: Partial<Category>): Promise<Category> {
        const { name } = categoryData;
        const category = await this.findOne(id);
  
        if(!category){
            throw new ApiError(
                'Nem uma categoria com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            )
        }

        category.name = name ?? category.name;

        category.updatedAt = new Date();

        return await this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<Category> {

        const categoryExists = await this.categoryRepository.exists({
            where: { id }
        });

        if (!categoryExists) {
            throw new ApiError(
                'Nem uma categoria com o id informado está cadastrado no sistema',
                StatusCodes.NOT_FOUND
            );
        }

        return await this.categoryRepository.softRemove({
            id: id
        });
    }
}