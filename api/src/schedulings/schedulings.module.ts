import { Module } from '@nestjs/common';
import { SchedulingsService } from './schedulings.service';
import { SchedulingsController } from './schedulings.controller';

@Module({
  controllers: [SchedulingsController],
  providers: [SchedulingsService],
})
export class SchedulingsModule {}
