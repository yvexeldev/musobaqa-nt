import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}
    @Get()
    async getAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        page = page || 1;
        limit = limit || 50;

        return await this.productService.getProducts(page, limit, search);
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.productService.getProduct(id);
    }
}
