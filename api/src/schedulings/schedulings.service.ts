import { Injectable } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class SchedulingsService {

  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService
  ) { }


  async create(createSchedulingDto: CreateSchedulingDto, userId: string) {
    const ability = this.abilityService.ability

    if (!ability.can('create', 'Scheduling')) {
      throw new Error('Unauthorized')
    }

    const schedulingExistsForUser = await this.prismaService.scheduling.findFirst({
      where: {
        clientId: userId,
        dateHour: createSchedulingDto.dateHour,
      }
    })
    const schedulingExistsForDateHour = await this.prismaService.scheduling.findFirst({
      where: {
        professionalId: createSchedulingDto.professionalId,
        dateHour: createSchedulingDto.dateHour,
      }
    })

    if (schedulingExistsForUser || schedulingExistsForDateHour) {
      throw new Error('Scheduling already exists')
    }

    return this.prismaService.scheduling.create({
      data: {
        ...createSchedulingDto,
        clientId: userId,
      },
    });

  }

  findAll() {
    const ability = this.abilityService.ability


    if (!ability.can('read', 'Scheduling')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.scheduling.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').Scheduling]
      }, select: {
        id: true,
        dateHour: true,
        status: true,
        client: {
          select: {
            name: true,
          }
        },
        professional: {
          select: {
            userId: true,
            user: {
              select: {
                name: true,
              }
            },
            category: {
              select: {
                name: true,
              }
            }
          },
        },
      }
    })
  }

  findAllProfessional() {
    const ability = this.abilityService.ability


    if (!ability.can('read', 'Scheduling')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.scheduling.findMany({
      where: {
        AND: [accessibleBy(ability, 'professional').Scheduling]
      }, select: {
        id: true,
        dateHour: true,
        status: true,
        client: {
          select: {
            name: true,
            id: true
          }
        },
        professional: {
          select: {
            userId: true,
            user: {
              select: {
                name: true,
              }
            },
            category: {
              select: {
                name: true,
              }
            }
          },
        },
      }
    })
  }


  async findOne(id: string) {
    const ability = this.abilityService.ability

    const scheduling = await this.prismaService.scheduling.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').Scheduling]
      }
    })

    if (!scheduling) {
      throw new Error('Scheduling not found')
    }

    return scheduling

  }

  async remove(id: string) {
    const ability = this.abilityService.ability

    const scheduling = await this.prismaService.scheduling.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').Scheduling]
      }
    })

    if (!scheduling) {
      throw new Error('Scheduling not found')
    }


    const timeSlot = await this.prismaService.timeSlot.findFirst({
      where: {
        profileId: scheduling.professionalId,
        dateTime: scheduling.dateHour
      }
    })

    if (!timeSlot) {
      throw new Error('TimeSlot not found')
    }

    await this.prismaService.timeSlot.update({
      where: {
        id: timeSlot.id
      },
      data: {
        isBooked: false
      }
    })


    return this.prismaService.scheduling.delete({
      where: {
        id,
        AND: [accessibleBy(ability, 'delete').Scheduling]
      }
    })

  }

  async removeByProfessional(id: string) {
    const ability = this.abilityService.ability

    const scheduling = await this.prismaService.scheduling.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'professional').Scheduling]
      }
    })

    if (!scheduling) {
      throw new Error('Scheduling not found')
    }


    const timeSlot = await this.prismaService.timeSlot.findFirst({
      where: {
        profileId: scheduling.professionalId,
        dateTime: scheduling.dateHour
      }
    })

    if (!timeSlot) {
      throw new Error('TimeSlot not found')
    }

    await this.prismaService.timeSlot.update({
      where: {
        id: timeSlot.id
      },
      data: {
        isBooked: false
      }
    })


    return this.prismaService.scheduling.delete({
      where: {
        id,
        AND: [accessibleBy(ability, 'professional').Scheduling]
      }
    })

  }
}
