import { Injectable } from '@nestjs/common';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { addMinutes, setHours, setMinutes, isBefore, setMilliseconds, setSeconds } from 'date-fns';
import { BookedTimeslotDto } from './dto/booked-timeslot.dto';
import { BlockedTimeslotDto } from './dto/blocked-timeslot.dto';

@Injectable()
export class TimeslotsService {

  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService
  ) { }


  async create(createTimeslotDto: CreateTimeslotDto, userId: string, days: number) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'TimeSlot')) {
      throw new Error('Unauthorized');
    }

    const profile = await this.prismaService.profile.findUnique({ where: { userId } });

    if (!profile || !profile.startTime || !profile.endTime || !profile.serviceDuration) {
      return;
    }

    const dias = profile.daysOfWeekWorked;
    const duracao = profile.serviceDuration;


    const ultimoSlot = await this.prismaService.timeSlot.findFirst({
      where: { profileId: userId },
      orderBy: { dateTime: 'desc' },
    });


    const dataInicial = ultimoSlot
      ? new Date(ultimoSlot.dateTime.getTime() + 24 * 60 * 60 * 1000)
      : new Date();

    const slots: any[] = [];

    let diasGerados = 0;
    let diaAtual = new Date(dataInicial);

    while (diasGerados < days) {
      const weekday = diaAtual.getDay();

      if (dias.includes(String(weekday))) {

        let start = setMilliseconds(
          setSeconds(
            setMinutes(
              setHours(new Date(diaAtual), profile.startTime.getHours()),
              profile.startTime.getMinutes()
            ),
            0
          ),
          0
        );

        const end = setMilliseconds(
          setSeconds(
            setMinutes(
              setHours(new Date(diaAtual), profile.endTime.getHours()),
              profile.endTime.getMinutes()
            ),
            0
          ),
          0
        );

        while (isBefore(start, end)) {
          slots.push({ dateTime: start, profileId: userId });
          start = addMinutes(start, duracao);
        }

        diasGerados++;
      }


      diaAtual.setDate(diaAtual.getDate() + 1);
    }

    await this.prismaService.timeSlot.createMany({
      data: slots,
      skipDuplicates: true,
    });
  }


  async booked(bookedTimeSlotDto: BookedTimeslotDto, userId: string) {
    const ability = this.abilityService.ability

    if (!ability.can('update', 'TimeSlot')) {
      throw new Error('Unauthorized')
    }

    const timeSlot = await this.prismaService.timeSlot.findFirst({
      where: {
        id: bookedTimeSlotDto.id,
        isBooked: false,
        isBlocked: false
      }
    })

    if (!timeSlot) {
      throw new Error('TimeSlot not exists')
    }

    await this.prismaService.timeSlot.update({
      where: { id: bookedTimeSlotDto.id },
      data: {
        isBooked: true
      }
    })

    return await this.prismaService.scheduling.create({
      data: {
        clientId: userId,
        dateHour: timeSlot.dateTime,
        professionalId: timeSlot.profileId,
        status: 'Agendado'
      }
    })

  }

  async blocked(blockedTimeSlotDto: BlockedTimeslotDto, userId: string) {

    const ability = this.abilityService.ability

    if (!ability.can('update', 'TimeSlot')) {
      throw new Error('Unauthorized')
    }

    const timeSlot = await this.prismaService.timeSlot.findFirst({
      where: {
        id: blockedTimeSlotDto.id,
        profileId: userId
      }
    })

    if (!timeSlot) {
      throw new Error('TimeSlot not exists')
    }

    return this.prismaService.timeSlot.update({
      where: {
        id: blockedTimeSlotDto.id,
        profileId: userId
      },
      data: {
        isBlocked: blockedTimeSlotDto.isBlocked,
        note: blockedTimeSlotDto.note
      }
    })


  }

  findAll(profileId: string) {
    const ability = this.abilityService.ability

    if (!ability.can('read', 'TimeSlot')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.timeSlot.findMany({
      where: {
        isBooked: false,
        isBlocked: false,
        profileId: profileId,
        dateTime: {
          gt: new Date(),
        },
      }
    })
  }

  findAllByProfissional(profileId: string) {
    const ability = this.abilityService.ability

    if (!ability.can('read', 'TimeSlot')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.timeSlot.findMany({
      where: {
        profileId: profileId,
        dateTime: {
          gt: new Date(),
        },
      },
      orderBy: {
        dateTime: 'asc'
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} timeslot`;
  }


  remove(id: number) {
    return `This action removes a #${id} timeslot`;
  }
}
