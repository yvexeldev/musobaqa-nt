import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { ShoppingModule } from './shopping/shopping.module';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        ProductModule,
        AddressModule,
        ShoppingModule,
        ChatModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
