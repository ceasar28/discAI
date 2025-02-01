import { Module } from '@nestjs/common';
import { DiscordBot1Service } from './discord-bot1.service';
import { HttpModule } from '@nestjs/axios';
import { DiscAiagentModule } from 'src/disc-aiagent/disc-aiagent.module';

@Module({
  imports: [HttpModule, DiscAiagentModule],
  providers: [DiscordBot1Service],
})
export class DiscordBot1Module {}
