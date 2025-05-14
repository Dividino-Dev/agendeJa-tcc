import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class CategoriesService {

    constructor(
      private prismaService: PrismaService,
      private abilityService : CaslAbilityService
    ){}


  create(createCategoryDto: CreateCategoryDto) {
    const ability = this.abilityService.ability

    if(!ability.can('create', 'Category')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.category.create({
      data: createCategoryDto
    });
  }

  findAll() {
    const ability = this.abilityService.ability

    return this.prismaService.category.findMany()
  }

  findOne(id: string) {
    return this.prismaService.category.findUnique({
      where : { id },
    })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const ability = this.abilityService.ability

    if(!ability.can('update', 'Category')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.category.update({
      where: {id},
      data: updateCategoryDto,
    })
  }

  remove(id: string) {
    const ability = this.abilityService.ability

    if(!ability.can('delete', 'Category')) {
      throw new Error('Unauthorized')
    }

    return this.prismaService.category.delete({
      where: { id }
    })
  }
}
