import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
    constructor(private readonly prisma: PrismaService) {}

    async getAddresses(page: number, limit: number, search: string) {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        console.log({ skip });

        const totalAddresses = await this.prisma.address.count();
        const maxPages = Math.ceil(totalAddresses / limit);
        const currentPage = +page;
        const nextPage = currentPage < maxPages ? +currentPage + 1 : null;
        const previousPage = currentPage > 1 ? currentPage - 1 : null;

        // Fetch all addresses and filter them based on distance
        const allAddresses = await this.prisma.address.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            skip,
            take,
            include: {
                shoppings: {
                    include: {
                        shopping: {
                            include: {
                                addresses: {
                                    include: {
                                        address: true, // Get full address details
                                    },
                                },
                                products: {
                                    include: {
                                        product: true, // Get full product details in shopping
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Filter addresses based on the distance from the given lat/lon

        return {
            addresses: allAddresses,
            totalAddresses: allAddresses.length,
            maxPages,
            currentPage,
            nextPage,
            previousPage,
        };
    }

    // Function to get a specific address by its ID
    async getAddress(id: string) {
        const address = await this.prisma.address.findUnique({
            where: { id },
            include: {
                shoppings: {
                    include: {
                        shopping: {
                            include: {
                                addresses: {
                                    include: {
                                        address: true, // Get full address details
                                    },
                                },
                                products: {
                                    include: {
                                        product: true, // Get full product details in shopping
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return address;
    }

    async getNearby(lon: number, lan: number, radius = 2000) {
        return await this.prisma.address.findMany({
            where: {
                long: {
                    gte: lon - radius,
                    lte: lon + radius,
                },
                lan: {
                    gte: lan - radius,
                    lte: lan + radius,
                },
            },
        });
    }
}
