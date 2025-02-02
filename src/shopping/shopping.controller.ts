import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('shopping')
export class ShoppingController {
    constructor(private shoppingService: ShoppingService) {}

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
        description: 'Search query to filter shoppings',
        schema: { type: 'string', default: '' }, // Optional, default to empty string
    })
    async getAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        page = page || 1;
        limit = limit || 50;

        return await this.shoppingService.getShoppings(page, limit, search);
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.shoppingService.getShopping(id);
    }
}
