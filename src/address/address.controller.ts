import { Controller, Get, Param, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('address')
export class AddressController {
    constructor(private addressService: AddressService) {}

    @Get('nearby')
    async getNearby(@Query('lon') lon: string, @Query('lan') lan: string) {
        return await this.addressService.getNearby(+lon, +lan);
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
        description: 'Search query to filter addresses',
        schema: { type: 'string', default: '' }, // Optional, default to empty string
    })
    async getAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        page = page || 1;
        limit = limit || 50;
        search = search || ''; // Default to empty string if search is not provided

        return await this.addressService.getAddresses(page, limit, search);
    }

    @Get(':id')
    async getAddress(@Param('id') id: string) {
        return this.addressService.getAddress(id);
    }
}
