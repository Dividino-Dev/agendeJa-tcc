import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from '@prisma/client';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService, 
    private prismaService : PrismaService,
    private abilityService : CaslAbilityService
  ){}

  async canActivate(
    context: ExecutionContext, 
  ): Promise<boolean>  {
    const request : Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]

    if(!token){
      throw new UnauthorizedException('Token not found')
    }

    try{
      const payload = this.jwtService.verify<{
        name: string,
        password: string,
        role: Roles,
        sub: string,
        permissions: string[]
      }>(token, {algorithms: ['HS256']})
      const user = await this.prismaService.user.findUnique({
        where : { id : payload.sub }
      })
      if(!user){
        throw new UnauthorizedException('User not found')
      }
      request.user = user
      this.abilityService.createForUser(user)
      
      return true
    }catch(e){
      console.error(e)
      throw new UnauthorizedException('Invalid Token', {cause: e})
    }

    return true;
  }
}
