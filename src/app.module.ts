import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscAiagentModule } from './disc-aiagent/disc-aiagent.module';
import { DiscordBot1Module } from './discord-bot1/discord-bot1.module';
import { DiscordBot2Module } from './discord-bot2/discord-bot2.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DiscAiagentModule,
    DiscordBot1Module,
    DiscordBot2Module,
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
