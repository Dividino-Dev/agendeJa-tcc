import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { RoleGuard } from 'src/auth/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookedTimeslotDto } from './dto/booked-timeslot.dto';
import { BlockedTimeslotDto } from './dto/blocked-timeslot.dto';

@UseGuards(AuthGuard, RoleGuard)
@Controller('timeslots')
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) { }

  @Post()
  create(@Body() createTimeslotDto: CreateTimeslotDto, @Req() req) {
    return this.timeslotsService.create(createTimeslotDto, req.user.id, +createTimeslotDto.days);
  }

  @Get('/profile/:id')
  findAll(@Param('id') id: string,) {
    return this.timeslotsService.findAll(id);
  }

  @Get('/profile/:id/all')
  findAllByProfessional(@Param('id') id: string,) {
    return this.timeslotsService.findAllByProfissional(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeslotsService.findOne(+id);
  }

  @Patch('/booked')
  booked(@Req() req, @Body() bookedTimeslotDto: BookedTimeslotDto) {
    return this.timeslotsService.booked(bookedTimeslotDto, req.user.id);
  }

  @Patch('/blocked')
  blocked(@Req() req, @Body() blockedTimeslotDto: BlockedTimeslotDto) {
    return this.timeslotsService.blocked(blockedTimeslotDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeslotsService.remove(+id);
  }
}
