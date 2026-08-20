import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    BookingsModule,
    PaymentMethodsModule,
    MessagesModule,
    DisputesModule,
    ReviewsModule,
    NotificationsModule,
    AdminModule,
    PricingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
