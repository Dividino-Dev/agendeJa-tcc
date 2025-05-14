import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class ProfilesService {

  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService
  ) { }


  async create(createProfileDto: CreateProfileDto, userId: string) {

    const ability = this.abilityService.ability

    if (!ability.can('create', 'Profile')) {
      throw new Error('Unauthorized')
    }

    const profileExists = await this.prismaService.profile.findFirst({
      where: {
        userId
      }
    })
    if (profileExists) {
      throw new Error('Profile already exists')
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        isProfessional: true
      }
    })

    return this.prismaService.profile.create({
      data: {
        ...createProfileDto,
        serviceDuration: createProfileDto.serviceDuration || 0,
        userId,
      },
    });
  }

  findAll() {
    const ability = this.abilityService.ability

    if (!ability.can('read', 'Profile')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.profile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  }

  findOne(id: string) {
    const ability = this.abilityService.ability

    if (!ability.can('read', 'Profile')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.profile.findUnique({
      where: { userId: id },
      include: {
        category: true,
      }
    })
  }

  myProfile(id: string) {
    const ability = this.abilityService.ability
    if (!ability.can('read', 'Profile')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.profile.findUnique({
      where: { userId: id },
      include: {
        category: true,
      }
    })
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {

    const ability = this.abilityService.ability

    const profile = this.prismaService.profile.findUnique({
      where: {
        userId: id,
        AND: [accessibleBy(ability, 'update').Profile]
      }
    })

    if (!profile) {
      throw new Error('Profile not found')
    }

    return this.prismaService.profile.update({
      where: { userId: id },
      data: updateProfileDto
    })
  }

  remove(id: string) {
    const ability = this.abilityService.ability

    if (!ability.can('delete', 'Profile')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.profile.delete({
      where: { userId: id }
    })
  }
}
