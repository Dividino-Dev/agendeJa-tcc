import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SchedulingsService } from './schedulings.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('schedulings')
export class SchedulingsController {
  constructor(private readonly schedulingsService: SchedulingsService) { }

  @Post()
  create(@Req() req, @Body() createSchedulingDto: CreateSchedulingDto) {
    return this.schedulingsService.create(createSchedulingDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.schedulingsService.findAll();
  }

  @Get('/professional')
  findAllProfessional() {
    return this.schedulingsService.findAllProfessional();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulingsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulingsService.remove(id);
  }

  @Delete(':id/professional')
  removeByProfessional(@Param('id') id: string) {
    return this.schedulingsService.removeByProfessional(id);
  }
}
