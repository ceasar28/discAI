import { Module } from '@nestjs/common';
import { DiscordBot2Service } from './discord-bot2.service';
import { HttpModule } from '@nestjs/axios';
import { DiscAiagentModule } from 'src/disc-aiagent/disc-aiagent.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LastMessage,
  LastMessageSchema,
} from 'src/disc-aiagent/schemas/chat.schema';

@Module({
  imports: [
    HttpModule,
    DiscAiagentModule,
    MongooseModule.forFeature([
      { name: LastMessage.name, schema: LastMessageSchema },
    ]),
  ],
  providers: [DiscordBot2Service],
})
export class DiscordBot2Module {}
