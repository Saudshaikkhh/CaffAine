import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    category: string; // HOT, COLD, DESSERT

    @IsString()
    @IsOptional()
    image?: string;

    @IsNumber()
    @IsOptional()
    inventory?: number;
}
