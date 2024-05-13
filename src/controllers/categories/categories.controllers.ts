import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../database/data-source";
import { Category } from "../../database/entity/categories";
import { ApiError } from "../../helpers/api-error";
import { categoryRequest } from "./types";


export class CategorieController {
    private categoryRepository = AppDataSource.getRepository(Category);

    async create(categoryData: categoryRequest): Promise<Category> {

        const existCategory = await this.categoryRepository.exists({
            where: { name: categoryData.name }
        })

        if(existCategory){
            throw new ApiError(
                'Categoria com esse nome já foi cadastrada no sistema',
                StatusCodes.CONFLICT
            );
        }

        return await this.categoryRepository.save(categoryData);
    }

    async find(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async findOne( id: number ): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });
    
        if (!category) {
            throw new ApiError(
                'Categoria não encontrada',
                StatusCodes.NOT_FOUND            
            );
        }
    
        return category;
    }

    async update(id: number, categories: categoryRequest): Promise<Category> {
        const category = await this.findOne(id);

        category.name = categories.name ?? category.name;

        category.updatedAt = new Date();

        return await this.categoryRepository.save(category);

    }
    
    async remove(id: number): Promise<{delete: boolean}> {
        const categoryToDelete = await this.categoryRepository.softDelete({
            id
        })

        if (!categoryToDelete) {
            throw new ApiError(
                'Categoria não encontrado para exclusão',
                StatusCodes.CONFLICT
            );
        }

        return {delete: true}

    }

}