import { Module } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { TimeslotsController } from './timeslots.controller';

@Module({
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
})
export class TimeslotsModule {}
