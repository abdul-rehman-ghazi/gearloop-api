import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { MessagesModule } from './messages/messages.module';
import { DisputesModule } from './disputes/disputes.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    BookingsModule,
    PaymentMethodsModule,
    MessagesModule,
    DisputesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
