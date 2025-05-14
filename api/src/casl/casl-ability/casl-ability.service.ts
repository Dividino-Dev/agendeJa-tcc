import { Injectable, Scope } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Category, Profile, Roles, Scheduling, User, TimeSlot } from '@prisma/client';

//Permissoes
// Manage por padrao ja faz todos (create, read, update e delete)
export type PermAction = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'professional'

export type PermissionResource = Subjects<{
  User: User,
  Category: Category,
  Profile: Profile,
  Scheduling: Scheduling,
  TimeSlot: TimeSlot
}> | 'all'

export type AppAbility = PureAbility<
  [PermAction, PermissionResource],
  PrismaQuery
>

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
  ADMIN(user, { can }) {
    can('manage', 'all')
  },
  USER(user, { can }) {
    can('read', 'User', { id: user.id })
    can('update', 'User', { id: user.id })
    can('delete', 'User', { id: user.id })

    can('read', 'Category')

    can('read', 'Profile')
    can('create', 'Profile')
    can('update', 'Profile', { userId: user.id })
    can('delete', 'Profile', { userId: user.id })

    can('professional', 'Scheduling', { professionalId: user.id })
    can('read', 'Scheduling', { clientId: user.id })
    can('create', 'Scheduling', { clientId: user.id })
    can('delete', 'Scheduling', { clientId: user.id })

    can('read', 'TimeSlot', { profileId: user.id })
    can('create', 'TimeSlot', { profileId: user.id })
    can('update', 'TimeSlot', { profileId: user.id })


  },
  PROFESSIONAL(user, { can }) {

  },
}

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {

  ability: AppAbility

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)
    rolePermissionsMap[user.role](user, builder)
    this.ability = builder.build()

    return this.ability
  }


}
