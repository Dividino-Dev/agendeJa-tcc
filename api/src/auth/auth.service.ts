import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { packRules } from '@casl/ability/extra'
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilitService: CaslAbilityService
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials')
    }

    const isPasswordValid = bcrypt.compareSync(
      loginDto.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials')
    }
    const ability = this.abilitService.createForUser(user)

    const token = this.jwtService.sign({
      name: user.name,
      email: user.email,
      role: user.role,
      sub: user.id,
      permissions: packRules(ability.rules)
    })

    return {
      access_token: token
    }
  }
}
