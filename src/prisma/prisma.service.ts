import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private logger = new Logger(PrismaService.name);

    async onModuleInit() {
        await this.$connect();
        this.logger.debug(`Database connected succesfully!`);
        await this.loadSeeds();
    }

    async loadSeeds() {
        const addressesData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../', '../seeds/addresses.json'),
                'utf-8',
            ),
        );

        const productsData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../', '../seeds/products.json'),
                'utf-8',
            ),
        );

        const shoppingsData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../', '../seeds/shoppings.json'),
                'utf-8',
            ),
        );

        // Insert Addresses
        await this.address.createMany({
            data: addressesData,
        });

        // Insert Products
        await this.product.createMany({
            data: productsData,
        });

        // Insert Shoppings and Many-to-Many Relations
        for (const shopping of shoppingsData) {
            await this.shopping.create({
                data: {
                    id: shopping.id,
                    name: shopping.name,
                    addresses: {
                        create: shopping.addressIds.map(
                            (addressId: string) => ({
                                address: { connect: { id: addressId } },
                            }),
                        ),
                    },
                    products: {
                        create: shopping.productIds.map(
                            (productId: string) => ({
                                product: { connect: { id: productId } },
                            }),
                        ),
                    },
                },
            });
        }

        this.logger.debug('Seed data loaded successfully!');
    }
}
