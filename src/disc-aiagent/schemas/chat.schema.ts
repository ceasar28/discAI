import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ChatDocument = mongoose.HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ default: 'botA' })
  roleA: string;
  @Prop()
  contentA: string;
  @Prop({ default: 'botB' })
  roleB: string;
  @Prop()
  contentB: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

export type TopicsDocument = mongoose.HydratedDocument<Topics>;

@Schema()
export class Topics {
  @Prop()
  topics: string[];
  @Prop()
  usedTopics: string[];
  @Prop()
  currentTopic: string;
}

export const TopicsSchema = SchemaFactory.createForClass(Topics);

export type RepliedCurrentTopicDocument =
  mongoose.HydratedDocument<RepliedCurrentTopic>;

@Schema()
export class RepliedCurrentTopic {
  @Prop()
  topic: string;
  @Prop({ default: false })
  repliedCurrentTopicA: boolean;
  @Prop({ default: false })
  repliedCurrentTopicB: boolean;
}

export const RepliedCurrentTopicSchema =
  SchemaFactory.createForClass(RepliedCurrentTopic);

export type DirectChatDocument = mongoose.HydratedDocument<Chat>;

@Schema()
export class DirectChat {
  @Prop()
  userId: number;
  @Prop()
  message: string;
  @Prop()
  response: string;
}

export const DirectChatSchema = SchemaFactory.createForClass(DirectChat);

export type TrainingDataDocument = mongoose.HydratedDocument<TrainingData>;

@Schema()
export class TrainingData {
  @Prop()
  authorA: number;
  @Prop()
  messageA: string;
  @Prop()
  authorB: number;
  @Prop()
  messageB: string;
}

export const TrainingDataSchema = SchemaFactory.createForClass(TrainingData);

export type LastMessageDocument = mongoose.HydratedDocument<LastMessage>;

@Schema()
export class LastMessage {
  @Prop()
  message: string;
}

export const LastMessageSchema = SchemaFactory.createForClass(LastMessage);
