import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HandoffPhotosController } from './handoff-photos.controller';
import { HandoffPhotosService } from './handoff-photos.service';

@Module({
  imports: [AuthModule],
  controllers: [HandoffPhotosController],
  providers: [HandoffPhotosService],
})
export class HandoffPhotosModule {}
