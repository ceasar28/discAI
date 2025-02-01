import { Module } from '@nestjs/common';
import { DiscAiagentService } from './disc-aiagent.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Chat,
  ChatSchema,
  DirectChat,
  DirectChatSchema,
  RepliedCurrentTopic,
  RepliedCurrentTopicSchema,
  Topics,
  TopicsSchema,
} from './schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Topics.name, schema: TopicsSchema }]),
    MongooseModule.forFeature([
      { name: RepliedCurrentTopic.name, schema: RepliedCurrentTopicSchema },
    ]),
    MongooseModule.forFeature([
      { name: DirectChat.name, schema: DirectChatSchema },
    ]),
    HttpModule,
  ],
  providers: [DiscAiagentService],
  exports: [DiscAiagentService],
})
export class DiscAiagentModule {}
