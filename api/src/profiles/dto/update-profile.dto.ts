import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  bio?: string
  avatar?: string
  isActive?: boolean

  serviceDuration?: number
  categoryId?: string
  daysOfWeekWorked?: string[]
  typeOfService?: string[]
  startTime?: Date
  endTime?: Date


}
