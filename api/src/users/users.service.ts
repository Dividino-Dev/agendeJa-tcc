import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class UsersService {

  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService
  ) { }


  async create(createUserDto: CreateUserDto) {

    const userExists = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email }
    })
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  findAll() {
    const ability = this.abilityService.ability

    return this.prismaService.user.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').User]
      }
    })
  }

  async findOne(id: string) {
    const ability = this.abilityService.ability

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'update').User]
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return this.prismaService.user.findUnique({
      where: { id, },
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const ability = this.abilityService.ability

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'update').User]
      }
    })

    if (!user) {
      throw new Error('User not found')
    }
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id }
    })
  }
}
