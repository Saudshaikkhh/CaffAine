import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';


export class CreateOrderItemDto {
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @IsInt()
    @IsNotEmpty()
    quantity: number;
}

export class CreateOrderDto {
    @IsInt()
    @IsOptional()
    userId?: number;

    @IsString()
    @IsOptional()
    tableNumber?: string;


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
