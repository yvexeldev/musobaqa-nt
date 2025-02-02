import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingService {
    constructor(private readonly prisma: PrismaService) {}
    async getShoppings(page: number, limit: number, search: string = '') {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        console.log({ skip });
        const totalShoppings = await this.prisma.shopping.count();
        const maxPages = Math.ceil(totalShoppings / limit);
        const currentPage = +page;
        const nextPage = currentPage < maxPages ? +currentPage + 1 : null;
        const previousPage = currentPage > 1 ? currentPage - 1 : null;

        const shoppings = await this.prisma.shopping.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            skip,
            take,
            include: {
                addresses: {
                    include: {
                        address: {
                            include: {
                                shoppings: true,
                            },
                        },
                        shopping: {
                            include: {
                                products: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            shoppings,
            totalShoppings,
            maxPages,
            currentPage,
            nextPage,
            previousPage,
        };
        // const shoppings = await this.prisma.product.findMany();
    }

    async getShopping(id: string) {
        const shopping = await this.prisma.shopping.findFirst({
            where: {
                id,
            },
            include: {
                addresses: {
                    include: {
                        address: {
                            include: {
                                shoppings: true,
                            },
                        },
                        shopping: {
                            include: {
                                products: true,
                            },
                        },
                    },
                },
            },
        });

        if (!shopping) throw new NotFoundException('Shopping not found!');
        return shopping;
    }
}
