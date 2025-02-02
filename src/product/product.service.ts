import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}
    async getProducts(page: number, limit: number, search: string = '') {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        console.log({ skip });
        const totalProducts = await this.prisma.product.count();
        const maxPages = Math.ceil(totalProducts / limit);
        const currentPage = +page;
        const nextPage = currentPage < maxPages ? +currentPage + 1 : null;
        const previousPage = currentPage > 1 ? currentPage - 1 : null;

        const products = await this.prisma.product.findMany({
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

        return {
            products,
            totalProducts,
            maxPages,
            currentPage,
            nextPage,
            previousPage,
        };
        // const products = await this.prisma.product.findMany();
    }

    async getProduct(id: string) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
            },
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

        if (!product) throw new NotFoundException('Product not found!');
        return product;
    }

    async getCheapest(productId: string) {
        const cheapestOptions = await this.prisma.shoppingProduct.findMany({
            where: {
                productId,
            },
            orderBy: {
                product: {
                    price: 'asc',
                },
            },
            include: {
                shopping: {
                    include: {
                        addresses: {
                            include: {
                                address: true, // Get full address details
                            },
                        },
                    },
                },
                product: true, // Get full product details
            },
        });

        if (!cheapestOptions.length)
            throw new NotFoundException(
                'No shops found with the given product!',
            );

        return cheapestOptions;
    }
}
