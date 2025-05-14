import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { CategoriesModule } from './categories/categories.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SchedulingsModule } from './schedulings/schedulings.module';
import { AvataresController } from './avatares/avatares.controller';
import { AvataresService } from './avatares/avatares.service';
import { TimeslotsModule } from './timeslots/timeslots.module';


@Module({
  imports: [UsersModule, PrismaModule, AuthModule, CaslModule, CategoriesModule, ProfilesModule, SchedulingsModule, TimeslotsModule],
  controllers: [AppController, AvataresController],
  providers: [AppService, AvataresService],
})
export class AppModule { }
