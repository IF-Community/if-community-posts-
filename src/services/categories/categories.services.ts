import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../database/data-source";
import { Category } from "../../database/entity/categories";
import { ApiError } from "../../helpers/api-error";
import { categoryRequest } from "./types/category";
import { PostCategory } from "../../database/entity/posts_categories";


export class CategorieServices {
    private categoryRepository = AppDataSource.getRepository(Category);
    private categoryPostRepository = AppDataSource.getRepository(PostCategory);

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

    async createPostCategory(postId: number ,categories: Array<{name: string, remove?: boolean}>) {
        for (const category of categories) {
            const existCategory = await this.categoryRepository.findOne({
                where: { name: category.name }
            });

            if (existCategory) {
                if(category.remove){
                    await this.categoryPostRepository.softDelete({
                        categoryId: existCategory.id,
                    });
                } else {
                    const existPostCategory = await this.categoryPostRepository.exists({
                        where: {
                            postId: postId,
                            categoryId: existCategory.id,
                        }
                    });

                    if(!existPostCategory){
                        await this.categoryPostRepository.save({
                            postId: postId,
                            categoryId: existCategory.id,
                        })
                    }
                }
            } else {

                const categorie = new Category();
                categorie.name = category.name; 
                const newCategorie = await this.categoryRepository.save(categorie);

                await this.categoryPostRepository.save({
                    postId: postId,
                    categoryId: newCategorie.id,
                })
            }
        }
    }

    async find(pageNumber: number, pageSize: number): Promise<{ totalPages: number, results: Category[] }> {

        const [categories, totalCount] = await this.categoryRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(totalCount / pageSize)

        return { totalPages, results: categories };
    }

    async findOne( id: number ): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });
    
        if (!category) {
            throw new ApiError(
                'Categoria com esse id não está cadastrado no sistema',
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

        await AppDataSource.transaction(async (transactionalManager) => {
            const categoryToDelete = await transactionalManager
            .getRepository(Category)
            .softDelete({ id });

            if (!categoryToDelete) {
                throw new ApiError(
                    'Categoria com esse id não está cadastrado no sistema',
                    StatusCodes.CONFLICT
                );
            }

            await this.categoryPostRepository.softDelete({
                categoryId: id
            });
        });

        return {delete: true}

    }

}
