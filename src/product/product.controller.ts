import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('cheapest/:id')
    async getCheapest(@Param('id') id: string) {
        return await this.productService.getCheapest(id);
    }

    @Get()
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        schema: { type: 'integer', default: 1 }, // Set default value to 1
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit of items per page',
        schema: { type: 'integer', default: 50 }, // Set default value to 50
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search query to filter products',
        schema: { type: 'string', default: '' }, // Optional, default to empty string
    })
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
