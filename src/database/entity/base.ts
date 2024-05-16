import { 
    CreateDateColumn, 
    DeleteDateColumn, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from 'typeorm';

export default abstract class Base {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int8' })
    id: number;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: null })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
    deletedAt: Date;
}