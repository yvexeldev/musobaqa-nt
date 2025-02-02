import { Controller, Get, Param, Query } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
    constructor(private addressService: AddressService) {}

    @Get('nearby')
    async getNearby(@Query('lon') lon: string, @Query('lan') lan: string) {
        return await this.addressService.getNearby(+lon, +lan);
    }

    @Get()
    async getAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        page = page || 1;
        limit = limit || 50;

        return await this.addressService.getAddresses(page, limit, search);
    }

    @Get(':id')
    async getAddress(@Param('id') id: string) {
        return this.addressService.getAddress(id);
    }
}
