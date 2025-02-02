import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShoppingService } from './shopping.service';

@Controller('shopping')
export class ShoppingController {
    constructor(private shoppingService: ShoppingService) {}
    @Get()
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
